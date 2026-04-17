<div align="center">

# 💎 Dycore SaaS
### Gestão Inteligente para Eventos, Decoração e Gráfica

**Uma plataforma robusta, moderna e intuitiva para transformar a operação do seu negócio.**  
Backend em **Flask** • Frontend em **React + Vite** • Banco de Dados **PostgreSQL (Neon.tech)**

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.x-black?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 🚀 O que é o Dycore?

O **Dycore** é mais do que um simples sistema de PDV. É um ecossistema completo (SaaS) projetado para centralizar o fluxo operacional de empresas que lidam com **locação de itens**, **encomendas personalizadas** e **vendas diretas**. 

Com foco em estética premium e usabilidade, o Dycore elimina a complexidade da gestão diária, permitindo que você foque no que realmente importa: a criatividade e o atendimento ao cliente.

---

## ✨ Destaques da Nova Interface (Redesign 2026)

Revisitamos completamente a experiência do usuário para criar algo **Premium** e **Moderno**:

*   **Sidebar Flyout Inteligente:** Navegação compacta que libera espaço de tela, com submenus que surgem com o passar do mouse.
*   **Gestão por Cards:** Chega de tabelas chatas. Produtos, Encomendas e Locações agora são gerenciados em cards visuais com barras de progresso reais.
*   **Agenda Visual Interativa:** Um calendário mensal poderoso para controle total de entregas, retiradas e compromissos.
*   **Login Split-Screen:** Uma porta de entrada elegante com gradientes dinâmicos e segurança JWT de última geração.

---

## 🛠️ Funcionalidades Principais

| Módulo | Descrição |
| :--- | :--- |
| 📊 **Dashboard 360°** | Métricas financeiras em tempo real, evolução de receitas e botões de acesso rápido. |
| 🛒 **PDV / Caixa** | Sistema de venda rápida com fluxos de pagamento (Dinheiro, PIX, Cartão, Fiado). |
| 📅 **Agenda Gerencial** | Calendário visual elegante para entregas e produção, inspirado em softwares de alta produtividade. |
| 📦 **Locação de Itens** | Gestão de contratos de locação com controle de disponibilidade e datas de devolução. |
| 🎨 **Encomendas Express** | Rastreio de produção (Pedido → Produção → Pronto → Entregue). |
| 💰 **Financeiro Completo** | Controle de Fiado (vendas a prazo), fluxo de caixa detalhado e gestão de despesas. |
| 🧾 **PDFs com PIX** | Geração automática de orçamentos e notas com QR Code PIX dinâmico (Copia e Cola). |
| 👥 **CRM & Estoque** | Cadastro inteligente de clientes e produtos com alerta de estoque baixo. |

---

## 💻 Tech Stack

### 🔥 Frontend
- **React 18** com **Vite 5** para performance de SPA instantânea.
- **Tailwind CSS** para um design "Pixel Perfect".
- **TanStack Query (v5)** para sincronização de dados e cache inteligente.
- **Lucide Icons** para uma iconografia limpa e moderna.

### ⚡ Backend & Banco
- **Flask (Backend)**: API RESTful robusta e segura.
- **PostgreSQL**: Escalabilidade garantida via Neon.tech.
- **ReportLab**: Motor de renderização de PDFs profissionais.
- **JWT Authentication**: Sessões seguras e persistentes.

---

## 📦 Instalação e Execução (Windows)

O Dycore foi projetado para ser fácil de rodar.

1.  Clone este repositório.
2.  Tenha o **Python 3.10+** instalado.
3.  Execute o arquivo: **`INICIAR_DYCORE.bat`**.

O script cuidará de:
*   Configurar o ambiente virtual (`.venv`).
*   Instalar todas as dependências necessárias.
*   Inicializar as migrações do banco de dados.
*   Lançar o servidor em **`http://localhost:5000`**.

### 🔐 Acesso Inicial
- **E-mail:** `admin@dripart.com`
- **Senha:** `123456`

---

## 📂 Estrutura do Projeto

```text
Projeto_Sistema_Gestao/
├── app.py                      # Core da API Flask
├── pdf_generator.py            # Motor de geração de PDFs & PIX
├── INICIAR_DYCORE.bat          # Startup script otimizado
├── decor-venue-flow-main/      # App Frontend (React)
│   ├── src/pages/              # Redesign Cards & Agenda
│   └── src/components/         # Sidebar & UI Base
├── docs/                       # Acervo de documentos gerados
└── backups/                    # Proteção de dados
```

---

## 🎨 Design System

O Dycore utiliza uma paleta de cores curada, baseada no **Jakarta Sans** e gradientes vibrantes:
- **Brand Pink:** `hsl(328 85% 56%)`
- **Cool Cyan:** `hsl(185 75% 48%)`
- **Surface Dark:** `hsl(225 15% 14%)`

---

<div align="center">

Idealizado e construído com 💜 para empresas que buscam excelência operacional.  
**Sua gestão, em outro nível.**

</div>
