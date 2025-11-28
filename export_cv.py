"""
Script pour exporter cv.html en PDF au format A4
Utilise Playwright pour un rendu fidèle avec les couleurs de fond
"""

from playwright.sync_api import sync_playwright
import os

def export_cv_to_pdf():
    # Chemin absolu vers le fichier HTML
    current_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(current_dir, 'cv.html')
    pdf_path = os.path.join(current_dir, 'CV_Guillaume_Bracaval.pdf')
    
    # Convertir en URL file://
    html_url = f'file:///{html_path.replace(os.sep, "/")}'
    
    print(f"📄 Chargement de {html_path}")
    
    with sync_playwright() as p:
        # Lancer le navigateur
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Charger la page
        page.goto(html_url)
        
        # Attendre que tout soit chargé
        page.wait_for_load_state('networkidle')
        
        # Exporter en PDF avec les bonnes options
        page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,  # Garder les couleurs de fond
            margin={
                'top': '0mm',
                'right': '0mm',
                'bottom': '0mm',
                'left': '0mm'
            }
        )
        
        browser.close()
    
    print(f"✅ PDF exporté : {pdf_path}")

if __name__ == '__main__':
    export_cv_to_pdf()
