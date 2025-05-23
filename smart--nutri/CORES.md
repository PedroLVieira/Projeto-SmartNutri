# Sistema de Cores SmartNutri

## 📋 Visão Geral
Este documento descreve o sistema de cores padronizado do SmartNutri, implementado para garantir consistência visual e facilitar a manutenção.

## 🎨 Paleta Principal

### Verde Principal (Marca SmartNutri)
- **50**: `#f0fdf4` - Verde muito claro (backgrounds sutis)
- **100**: `#dcfce7` - Verde claro (success messages)
- **200**: `#bbf7d0` - Verde suave (borders, dividers)
- **300**: `#86efac` - Verde médio claro (icons secundários)
- **400**: `#4ade80` - Verde médio (hover states)
- **500**: `#22c55e` - Verde padrão
- **600**: `#16a34a` - **Verde principal** (botões primários, links)
- **700**: `#15803d` - Verde escuro (hover em botões, textos importantes)
- **800**: `#166534` - Verde muito escuro
- **900**: `#14532d` - Verde mais escuro

### Azul Secundário
- **600**: `#3b82f6` - Azul principal (elementos secundários)
- **700**: `#1d4ed8` - Azul escuro

### Cores Neutras (Cinzas)
- **50**: `#f9fafb` - Background da página
- **100**: `#f3f4f6` - Backgrounds discretos
- **200**: `#e5e7eb` - Bordas claras
- **300**: `#d1d5db` - Bordas médias, elementos desabilitados
- **400**: `#9ca3af` - Bordas escuras
- **500**: `#6b7280` - Textos discretos
- **600**: `#4b5563` - Textos secundários
- **700**: `#374151` - Textos escuros
- **800**: `#1f2937` - Textos muito escuros
- **900**: `#111827` - Texto principal

### Cores de Estado
- **Sucesso**: `#16a34a` (mesmo verde principal)
- **Erro**: `#dc2626` (vermelho)
- **Aviso**: `#f59e0b` (laranja)
- **Info**: `#0ea5e9` (azul claro)

## 🛠️ Como Usar

### Variáveis CSS Principais
```css
/* Cores da marca */
--smartnutri-primary-600    /* Verde principal */
--smartnutri-primary-700    /* Verde escuro */

/* Aliases semânticos (mais fáceis de usar) */
--text-primary              /* Texto principal */
--text-secondary            /* Texto secundário */
--bg-page                   /* Background da página */
--bg-card                   /* Background de cards */
--border-light              /* Bordas claras */
--interactive-hover         /* Hover em botões */
```

### Exemplos de Uso

#### Botão Primário
```css
.btn-primary {
  background-color: var(--smartnutri-primary-600);
  color: var(--text-inverse);
}

.btn-primary:hover {
  background-color: var(--interactive-hover);
}
```

#### Card
```css
.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
}
```

#### Alert de Sucesso
```css
.alert-success {
  background-color: var(--smartnutri-success-50);
  border: 1px solid var(--smartnutri-success-100);
  color: var(--smartnutri-success-700);
}
```

## 📁 Arquivos Atualizados

### ✅ Já Padronizados
- `colors.css` - Sistema principal de cores
- `global.css` - Importa o sistema de cores
- `shared.css` - Usa aliases das cores padronizadas
- `gerenciar-plano-alimentar.css` - Cores atualizadas
- `add-button-styles.css` - Cores dos botões atualizadas

### 🔄 Próximos a Serem Atualizados
- `navbar.css`
- `dashboard-nutricionista.css`
- `dashboard-cliente.css`
- `login.css`
- `register.css`
- E outros arquivos CSS conforme necessário

## 🎯 Benefícios

1. **Consistência Visual**: Todos os componentes usam as mesmas cores
2. **Manutenção Fácil**: Mudança em uma variável afeta todo o sistema
3. **Escalabilidade**: Fácil adicionar novos tons ou ajustar existentes
4. **Acessibilidade**: Cores escolhidas com bom contraste
5. **Branding**: Cores alinhadas com a identidade visual do SmartNutri

## 🔧 Manutenção

### Para Adicionar Nova Cor
1. Adicione no arquivo `colors.css`
2. Documente aqui o uso previsto
3. Teste em diferentes componentes

### Para Alterar Cor Existente
1. Modifique apenas no arquivo `colors.css`
2. Teste em toda a aplicação
3. Atualize esta documentação se necessário

## 📝 Regras de Uso

1. **SEMPRE** use variáveis CSS ao invés de cores hardcoded
2. **PREFIRA** aliases semânticos (ex: `--text-primary`) quando possível
3. **TESTE** mudanças em diferentes navegadores e modos (claro/escuro)
4. **DOCUMENTE** novos usos ou padrões neste arquivo

---

**Última atualização**: 23/05/2025
**Versão do sistema de cores**: 1.0
