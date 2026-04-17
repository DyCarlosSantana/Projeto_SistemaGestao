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
        'sub': str(user['id']),
        'nome': user.get('nome', ''),
        'email': user.get('email', ''),
        'role': user.get('role', 'operador'),
        'permissoes': user.get('permissoes', []),
        'empresa_id': user.get('empresa_id', 1),
        'modulos': user.get('modulos', []),   # Lista de modulos ativos do tenant
        'iat': agora,
        'exp': agora + datetime.timedelta(hours=JWT_EXPIRATION_HOURS),
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
    """Extrai o token do header Authorization ou da query string."""
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:]
    
    # Suporte para exportação de PDF em nova aba que não consegue enviar headers
    token_query = request.args.get('token')
    if token_query:
        return token_query

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


def get_current_role() -> str:
    """Retorna o role do usuário autenticado na requisição atual."""
    user = get_current_user()
    if user:
        return user.get('role', 'operador')
    return 'operador'


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
    Decorator que exige role 'admin'. Deve ser usado com @require_auth.
    Atalho para @require_role('admin').
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


def require_role(*roles):
    """
    Decorator granular de RBAC. Permite especificar um ou mais roles aceitos.

    Roles disponíveis: 'admin', 'gerente', 'operador'
    Hierarquia: admin > gerente > operador

    Uso:
        @app.route('/api/relatorios')
        @require_auth
        @require_role('admin', 'gerente')
        def relatorios():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = get_current_user()
            if not user:
                return jsonify({'erro': 'Nao autenticado.', 'codigo': 'NAO_AUTENTICADO'}), 401

            user_role = user.get('role', 'operador')

            # Admin sempre tem acesso total
            if user_role == 'admin':
                return f(*args, **kwargs)

            if user_role not in roles:
                return jsonify({
                    'erro': f'Acesso negado. Permissao necessaria: {" ou ".join(roles)}.',
                    'codigo': 'PERMISSAO_INSUFICIENTE'
                }), 403

            return f(*args, **kwargs)
        return decorated
    return decorator
