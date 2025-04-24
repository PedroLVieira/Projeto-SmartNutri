def before_all(context):
    """Configuração que é executada antes de todos os testes"""
    # Definir uma URL base padrão para testes de API
    context.base_url = "http://localhost:8000"

def before_scenario(context, scenario):
    """Configuração específica para cada cenário"""
    # Para cenários web, definimos um browser fictício
    if 'web' in scenario.tags:
        # Criar um mock mínimo para os testes web
        class MockBrowser:
            def get(self, url): pass
            def find_element(self, *args, **kwargs): return MockElement()
            def find_elements(self, *args, **kwargs): return []
            def quit(self): pass
            
        class MockElement:
            def click(self): pass
            def clear(self): pass
            def send_keys(self, *args): pass
            def get_attribute(self, name): return ""
            
        context.browser = MockBrowser()
        
def after_scenario(context, scenario):
    """Limpeza após cada cenário"""
    if hasattr(context, 'browser'):
        delattr(context, 'browser')