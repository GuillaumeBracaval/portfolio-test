/**
 * Script pour exporter cv.html en PDF au format A4
 * Utilise Puppeteer pour un rendu fidèle avec les couleurs de fond
 * 
 * Installation: npm install puppeteer
 * Utilisation: node export_cv.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function exportCvToPdf() {
    const htmlPath = path.join(__dirname, 'cv.html');
    const pdfPath = path.join(__dirname, 'CV_Guillaume_Bracaval.pdf');

    // Vérifier que le fichier HTML existe
    if (!fs.existsSync(htmlPath)) {
        console.error(`❌ Fichier non trouvé: ${htmlPath}`);
        process.exit(1);
    }

    console.log(`📄 Chargement de ${htmlPath}`);

    // Lancer le navigateur
    const browser = await puppeteer.launch({
        headless: 'new'
    });

    const page = await browser.newPage();

    // Définir la taille de la page exactement A4
    await page.setViewport({
        width: 794,  // 210mm en pixels à 96 DPI
        height: 1123 // 297mm en pixels à 96 DPI
    });

    // Charger la page HTML
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0'
    });

    // Injecter du CSS pour que le CV remplisse exactement la page
    await page.addStyleTag({
        content: `
            html, body {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
            .cv-container {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                box-shadow: none !important;
            }
        `
    });

    // Exporter en PDF
    await page.pdf({
        path: pdfPath,
        width: '210mm',
        height: '297mm',
        printBackground: true,
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        }
    });

    await browser.close();

    console.log(`✅ PDF exporté : ${pdfPath}`);
}

exportCvToPdf().catch(err => {
    console.error('❌ Erreur:', err);
    process.exit(1);
});
