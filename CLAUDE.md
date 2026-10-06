# EasyAPP — site publicado (GitHub Pages)

Este repositório é só o que vai ao ar em easyappfinancial.com.br. O código-fonte e as regras de
trabalho estão no repositório `easyapp-financial` (veja o CLAUDE.md de lá):

- `gestao.html` é cópia de `easyapp-financial/site/gestao.html` (suba `VERSAO_PAINEL` a cada mudança).
- `app/index.html` é cópia de `easyapp-financial/app/index.html` (só o `<head>` difere).
- Sempre publicar: push na `main` publica o site (workflow `.github/workflows/site.yml`; o Pages está em Source: GitHub Actions desde 06/10/2026).
