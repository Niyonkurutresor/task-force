export const exportToPDF = async (id: string, orientation?: string) => {
	const elementToExport = document.getElementById(id);
	const pdfOptions = {
		margin: 10,
		filename: `${id}.pdf`,
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2 },
		jsPDF: { unit: 'mm', format: 'a4', orientation: orientation ?? 'portrait' }
	};
	const html2pdfModule = await import('html2pdf.js');
	const html2pdf = html2pdfModule.default || html2pdfModule;
	html2pdf().set(pdfOptions).from(elementToExport).save();
};
