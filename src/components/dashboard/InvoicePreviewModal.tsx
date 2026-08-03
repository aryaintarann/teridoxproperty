import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

interface InvoicePreviewModalProps {
  invoice: any;
  isOpen: boolean;
  onClose: () => void;
}

export const printInvoice = (invoice: any) => {
  if (!invoice) return;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const content = `
    <html>
      <head>
        <title>Invoice - ${invoice.id}</title>
        <style>
          @media print {
            @page { margin: 2cm; size: A4 portrait; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12pt; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #0f172a; font-size: 24pt; }
            .company-info { text-align: right; font-size: 10pt; color: #64748b; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .bill-to h3 { margin-bottom: 5px; color: #64748b; font-size: 10pt; text-transform: uppercase; }
            .bill-to p { margin: 0; font-weight: bold; font-size: 12pt; }
            .meta-data table { text-align: right; font-size: 10pt; }
            .meta-data td { padding: 3px 0 3px 15px; }
            .table-container { margin-bottom: 40px; }
            table.items { width: 100%; border-collapse: collapse; }
            table.items th { background: #f8fafc; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 10pt; text-transform: uppercase; }
            table.items td { padding: 15px 10px; border-bottom: 1px solid #e2e8f0; }
            .total-row { font-weight: bold; font-size: 14pt; }
            .total-row td { border-bottom: none; border-top: 2px solid #0f172a; }
            .payment-instructions { background: #f8fafc; padding: 20px; border-radius: 8px; font-size: 10pt; }
            .payment-instructions h3 { margin-top: 0; margin-bottom: 10px; font-size: 11pt; }
          }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>INVOICE</h1>
            <p style="margin-top: 5px; font-weight: bold; color: #64748b;">${invoice.id}</p>
          </div>
          <div class="company-info">
            <strong>Teridox Property</strong><br>
            Jl. Jend. Sudirman Kav. 52-53<br>
            Jakarta Selatan, 12190<br>
            billing@teridox.com
          </div>
        </div>

        <div class="invoice-details">
          <div class="bill-to">
            <h3>Ditagihkan Kepada:</h3>
            <p>${invoice.tenant_name}</p>
            <p style="font-weight: normal; font-size: 11pt; color: #64748b; margin-top: 5px;">Unit: ${invoice.unit}</p>
          </div>
          <div class="meta-data">
            <table>
              <tr><td style="color: #64748b;">Tanggal Invoice:</td><td><strong>${currentDate}</strong></td></tr>
              <tr><td style="color: #64748b;">Jatuh Tempo:</td><td><strong>${invoice.due_date}</strong></td></tr>
              <tr><td style="color: #64748b;">Status:</td><td style="color: ${invoice.status === 'Paid' ? '#10b981' : invoice.status === 'Overdue' ? '#ef4444' : '#f59e0b'}; font-weight: bold; text-transform: uppercase;">${invoice.status}</td></tr>
            </table>
          </div>
        </div>

        <div class="table-container">
          <table class="items">
            <thead>
              <tr>
                <th>Deskripsi Tagihan</th>
                <th style="text-align: center;">Tipe</th>
                <th style="text-align: right;">Total Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tagihan ${invoice.type} untuk Unit ${invoice.unit}</td>
                <td style="text-align: center;">${invoice.type}</td>
                <td style="text-align: right; font-weight: bold;">${invoice.amount}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" style="text-align: right; padding-top: 20px;">Total Tagihan:</td>
                <td style="text-align: right; padding-top: 20px; color: #0f172a;">${invoice.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${invoice.status !== 'Paid' ? `
        <div class="payment-instructions">
          <h3>Instruksi Pembayaran</h3>
          <p>Harap melakukan pembayaran tepat waktu sebelum tanggal jatuh tempo <strong>(${invoice.due_date})</strong> ke rekening berikut:</p>
          <p style="font-size: 12pt; margin-top: 15px;">
            Bank: <strong>Bank BCA (Fiktif)</strong><br>
            Atas Nama: <strong>Teridox Property</strong><br>
            No. Rekening: <strong>1234-5678-90</strong>
          </p>
          <p style="margin-top: 15px; color: #64748b;">* Harap unggah bukti transfer pada dashboard portal Anda setelah melakukan pembayaran.</p>
        </div>
        ` : `
        <div style="text-align: center; margin-top: 50px; border: 2px dashed #10b981; color: #10b981; padding: 20px; border-radius: 8px; font-weight: bold; font-size: 16pt; letter-spacing: 2px;">
          LUNAS / PAID
        </div>
        `}
      </body>
    </html>
  `;

  iframe.contentWindow?.document.open();
  iframe.contentWindow?.document.write(content);
  iframe.contentWindow?.document.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 250);
};

export function InvoicePreviewModal({ invoice, isOpen, onClose }: InvoicePreviewModalProps) {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MaterialIcon name="receipt_long" className="text-td-primary" />
            Preview Invoice
          </DialogTitle>
        </DialogHeader>
        
        {/* Virtual Paper Preview */}
        <div className="bg-white text-slate-800 border border-slate-200 p-8 rounded-md my-4 shadow-inner max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between border-b-2 border-slate-800 pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">INVOICE</h1>
              <p className="font-bold text-slate-500 mt-1">{invoice.id}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <strong className="text-sm">Teridox Property</strong><br/>
              Jl. Jend. Sudirman Kav. 52-53<br/>
              Jakarta Selatan, 12190<br/>
              billing@teridox.com
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <h3 className="text-xs text-slate-500 uppercase font-bold mb-1">Ditagihkan Kepada:</h3>
              <p className="font-bold text-lg">{invoice.tenant_name}</p>
              <p className="text-sm text-slate-500">Unit: {invoice.unit}</p>
            </div>
            <div className="text-right text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-slate-500">Tanggal Invoice:</span>
                <strong className="text-slate-900">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                
                <span className="text-slate-500">Jatuh Tempo:</span>
                <strong className="text-slate-900">{invoice.due_date}</strong>
                
                <span className="text-slate-500">Status:</span>
                <strong className={`uppercase ${invoice.status === 'Paid' ? 'text-emerald-600' : invoice.status === 'Overdue' ? 'text-rose-600' : 'text-amber-500'}`}>
                  {invoice.status}
                </strong>
              </div>
            </div>
          </div>

          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-300 text-slate-500 uppercase">
                <th className="text-left p-2">Deskripsi Tagihan</th>
                <th className="text-center p-2">Tipe</th>
                <th className="text-right p-2">Total Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-4">Tagihan {invoice.type} untuk Unit {invoice.unit}</td>
                <td className="p-4 text-center">{invoice.type}</td>
                <td className="p-4 text-right font-bold">{invoice.amount}</td>
              </tr>
              <tr>
                <td colSpan={2} className="text-right p-4 font-bold border-t-2 border-slate-800">Total Tagihan:</td>
                <td className="text-right p-4 font-bold text-lg border-t-2 border-slate-800">{invoice.amount}</td>
              </tr>
            </tbody>
          </table>

          {invoice.status !== 'Paid' ? (
            <div className="bg-slate-50 p-4 rounded-lg text-sm border border-slate-200">
              <h3 className="font-bold text-base mb-2">Instruksi Pembayaran</h3>
              <p>Harap melakukan pembayaran tepat waktu sebelum tanggal jatuh tempo <strong>({invoice.due_date})</strong> ke rekening berikut:</p>
              <div className="mt-4 mb-2 text-base">
                <p>Bank: <strong>Bank BCA (Fiktif)</strong></p>
                <p>Atas Nama: <strong>Teridox Property</strong></p>
                <p>No. Rekening: <strong>1234-5678-90</strong></p>
              </div>
              <p className="text-xs text-slate-500 italic mt-4">* Harap unggah bukti transfer pada dashboard portal Anda setelah melakukan pembayaran.</p>
            </div>
          ) : (
            <div className="text-center mt-8 border-2 border-dashed border-emerald-500 text-emerald-600 p-4 rounded-lg font-bold text-2xl tracking-widest">
              LUNAS / PAID
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={() => printInvoice(invoice)} className="bg-td-primary hover:bg-td-primary/90 text-td-on-primary">
            <MaterialIcon name="print" className="mr-2" /> Download / Print PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
