"""
auth.py — Módulo de Autenticação JWT para o Dycore
===================================================
Responsável pela geração, validação e proteção de rotas via JWT.

Uso:
    from auth import require_auth, get_current_user, gerar_token

    @app.route('/api/algo')
    @require_auth
    def minha_rota():
        user = get_current_user()
        # user = {'id': 1, 'role': 'admin', 'empresa_id': 1, 'nome': '...'}
        ...
"""

import os
import jwt
import datetime
from functools import wraps
from flask import request, jsonify, g

# ─── CONFIGURAÇÃO ─────────────────────────────────────────────────────────────

# Carrega a chave secreta. Em produção, configurar via variável de ambiente.
# Nunca deixar hardcoded em produção.
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'dycore-dev-secret-CHANGE-IN-PRODUCTION')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES_HOURS', '8'))


# ─── GERAÇÃO DE TOKEN ─────────────────────────────────────────────────────────

def gerar_token(user: dict) -> str:
    """
    Gera um JWT para o usuário autenticado.

    Args:
        user: dicionário com id, nome, email, role, e opcionalmente empresa_id

    Returns:
        Token JWT assinado como string
    """
    agora = datetime.datetime.utcnow()
    payload = {
        'sub': str(user['id']),           # Subject: ID do usuário
        'nome': user.get('nome', ''),
        'email': user.get('email', ''),
        'role': user.get('role', 'operador'),
        'empresa_id': user.get('empresa_id', 1),  # Preparação para multi-tenancy
        'iat': agora,                              # Issued At
        'exp': agora + datetime.timedelta(hours=JWT_EXPIRATION_HOURS),  # Expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ─── VALIDAÇÃO DE TOKEN ───────────────────────────────────────────────────────

def validar_token(token: str) -> dict | None:
    """
    Decodifica e valida um JWT.

    Returns:
        Payload do token se válido, ou None se inválido/expirado
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def _extrair_token_do_header() -> str | None:
    """Extrai o Bearer token do header Authorization."""
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:]
    return None


# ─── CONTEXTO DO USUÁRIO ATUAL ────────────────────────────────────────────────

def get_current_user() -> dict | None:
    """
    Retorna os dados do usuário autenticado na requisição atual.
    Disponível apenas dentro de funções protegidas com @require_auth.
    """
    return getattr(g, 'current_user', None)


def get_empresa_id() -> int:
    """
    Retorna o empresa_id do usuário autenticado.
    Usado para filtrar dados por tenant (multi-tenancy).
    """
    user = get_current_user()
    if user:
        return int(user.get('empresa_id', 1))
    return 1


# ─── DECORATOR DE PROTEÇÃO ────────────────────────────────────────────────────

def require_auth(f):
    """
    Decorator que protege endpoints exigindo autenticação JWT válida.

    Uso:
        @app.route('/api/clientes')
        @require_auth
        def listar_clientes():
            ...
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = _extrair_token_do_header()

        if not token:
            return jsonify({
                'erro': 'Token de autenticação não fornecido.',
                'codigo': 'TOKEN_AUSENTE'
            }), 401

        payload = validar_token(token)
        if not payload:
            return jsonify({
                'erro': 'Token inválido ou expirado. Faça login novamente.',
                'codigo': 'TOKEN_INVALIDO'
            }), 401

        # Armazena os dados do usuário no contexto da requisição
        g.current_user = payload
        return f(*args, **kwargs)

    return decorated


def require_admin(f):
    """
    Decorator que exige que o usuário autenticado tenha role 'admin'.
    Deve ser usado em conjunto com @require_auth.

    Uso:
        @app.route('/api/usuarios')
        @require_auth
        @require_admin
        def listar_usuarios():
            ...
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user or user.get('role') != 'admin':
            return jsonify({
                'erro': 'Acesso negado. Apenas administradores podem acessar este recurso.',
                'codigo': 'ACESSO_NEGADO'
            }), 403
        return f(*args, **kwargs)
    return decorated
