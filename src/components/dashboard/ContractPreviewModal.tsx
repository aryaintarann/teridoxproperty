import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

interface ContractPreviewModalProps {
  contract: any;
  isOpen: boolean;
  onClose: () => void;
}

export const printContract = (contract: any) => {
  if (!contract) return;
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const content = `
    <html>
      <head>
        <title>Surat Perjanjian Sewa Menyewa - ${contract.id}</title>
        <style>
          @media print {
            @page { margin: 2cm; size: A4 portrait; }
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: black; }
            h1 { text-align: center; font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 20px; }
            h2 { font-size: 12pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
            p { text-align: justify; margin-bottom: 10px; }
            .party-info { margin-left: 20px; margin-bottom: 15px; }
            .party-info table { width: 100%; }
            .party-info td { vertical-align: top; padding: 2px; }
            .party-info td:first-child { width: 120px; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; text-align: center; }
            .signature-box { width: 45%; }
            .materai { border: 1px dashed #666; width: 100px; height: 60px; margin: 0 auto 10px auto; display: flex; align-items: center; justify-content: center; font-size: 8pt; color: #666; }
          }
          body { font-family: 'Times New Roman', serif; padding: 40px; }
        </style>
      </head>
      <body>
        <h1>SURAT PERJANJIAN SEWA MENYEWA</h1>
        
        <p>Pada hari ini, tanggal <strong>${currentDate}</strong>, bertempat di Jakarta, telah dibuat dan disepakati perjanjian sewa menyewa oleh dan antara:</p>
        
        <div class="party-info">
          <table>
            <tr><td>Nama</td><td>: Manajemen Teridox Property</td></tr>
            <tr><td>Jabatan</td><td>: Pengelola / Pemilik Properti</td></tr>
            <tr><td>Alamat</td><td>: Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan</td></tr>
          </table>
          <p style="margin-top:5px; font-weight:bold;">Selanjutnya disebut sebagai PIHAK PERTAMA (Yang Menyewakan).</p>
        </div>

        <div class="party-info">
          <table>
            <tr><td>Nama</td><td>: <strong>${contract.tenant_name}</strong></td></tr>
            <tr><td>ID Penyewa</td><td>: ${contract.tenant_id}</td></tr>
          </table>
          <p style="margin-top:5px; font-weight:bold;">Selanjutnya disebut sebagai PIHAK KEDUA (Penyewa).</p>
        </div>

        <p>Kedua belah pihak telah sepakat untuk mengikatkan diri dalam Perjanjian Sewa Menyewa dengan ketentuan dan syarat-syarat sebagai berikut:</p>

        <h2>PASAL 1 - OBJEK SEWA</h2>
        <p>PIHAK PERTAMA dengan ini menyewakan kepada PIHAK KEDUA dan PIHAK KEDUA dengan ini menyewa dari PIHAK PERTAMA, sebuah unit properti dengan rincian: <strong>${contract.unit}</strong>.</p>

        <h2>PASAL 2 - JANGKA WAKTU</h2>
        <p>Perjanjian sewa menyewa ini dilangsungkan dan diterima untuk jangka waktu mulai tanggal <strong>${contract.start_date}</strong> sampai dengan tanggal <strong>${contract.end_date}</strong>.</p>

        <h2>PASAL 3 - HAK DAN KEWAJIBAN</h2>
        <p>1. PIHAK KEDUA wajib memelihara dan menjaga kebersihan serta keutuhan objek sewa dengan sebaik-baiknya.<br>
           2. Segala kerusakan yang timbul akibat kelalaian PIHAK KEDUA menjadi tanggung jawab sepenuhnya dari PIHAK KEDUA.<br>
           3. PIHAK KEDUA tidak diperkenankan untuk mengalihkan hak sewa atau menyewakan kembali objek sewa kepada pihak ketiga tanpa persetujuan tertulis dari PIHAK PERTAMA.</p>

        <h2>PASAL 4 - PENYELESAIAN PERSELISIHAN</h2>
        <p>Apabila terjadi perselisihan sehubungan dengan pelaksanaan perjanjian ini, maka kedua belah pihak akan menyelesaikannya secara musyawarah untuk mufakat.</p>

        <p style="margin-top: 30px;">Demikian Surat Perjanjian ini dibuat dalam rangkap 2 (dua) yang masing-masing bermeterai cukup dan mempunyai kekuatan hukum yang sama, ditandatangani oleh kedua belah pihak dalam keadaan sadar dan tanpa paksaan dari pihak manapun.</p>

        <div class="signatures">
          <div class="signature-box">
            <p><strong>PIHAK PERTAMA</strong></p>
            <br><br><br><br>
            <p>( Manajemen Teridox Property )</p>
          </div>
          <div class="signature-box">
            <p><strong>PIHAK KEDUA</strong></p>
            <div class="materai">
              METERAI<br>Rp 10.000
            </div>
            <p>( <strong>${contract.tenant_name}</strong> )</p>
          </div>
        </div>
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

export function ContractPreviewModal({ contract, isOpen, onClose }: ContractPreviewModalProps) {
  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MaterialIcon name="gavel" className="text-td-primary" />
            Preview Kontrak Legal (Surat Perjanjian Sewa Menyewa)
          </DialogTitle>
        </DialogHeader>
        
        {/* Virtual Paper Preview */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-md my-4 font-serif text-sm text-foreground shadow-inner max-h-[60vh] overflow-y-auto">
          <h1 className="text-center font-bold text-lg underline mb-6">SURAT PERJANJIAN SEWA MENYEWA</h1>
          
          <p className="mb-4 text-justify">
            Pada hari ini, tanggal <strong>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>, bertempat di Jakarta, telah dibuat dan disepakati perjanjian sewa menyewa oleh dan antara:
          </p>

          <div className="ml-4 mb-4">
            <table className="w-full">
              <tbody>
                <tr><td className="w-24 align-top">Nama</td><td className="w-4 align-top">:</td><td>Manajemen Teridox Property</td></tr>
                <tr><td className="align-top">Jabatan</td><td className="align-top">:</td><td>Pengelola / Pemilik Properti</td></tr>
              </tbody>
            </table>
            <p className="font-bold mt-1">Selanjutnya disebut sebagai PIHAK PERTAMA (Yang Menyewakan).</p>
          </div>

          <div className="ml-4 mb-4">
            <table className="w-full">
              <tbody>
                <tr><td className="w-24 align-top">Nama</td><td className="w-4 align-top">:</td><td><strong>{contract.tenant_name}</strong></td></tr>
                <tr><td className="align-top">ID Penyewa</td><td className="align-top">:</td><td>{contract.tenant_id}</td></tr>
              </tbody>
            </table>
            <p className="font-bold mt-1">Selanjutnya disebut sebagai PIHAK KEDUA (Penyewa).</p>
          </div>

          <p className="mb-4 text-justify">Kedua belah pihak telah sepakat untuk mengikatkan diri dalam Perjanjian Sewa Menyewa dengan ketentuan dan syarat-syarat sebagai berikut:</p>

          <h2 className="font-bold mb-1 mt-4">PASAL 1 - OBJEK SEWA</h2>
          <p className="mb-4 text-justify">PIHAK PERTAMA dengan ini menyewakan kepada PIHAK KEDUA dan PIHAK KEDUA dengan ini menyewa dari PIHAK PERTAMA, sebuah unit properti dengan rincian: <strong>{contract.unit}</strong>.</p>

          <h2 className="font-bold mb-1 mt-4">PASAL 2 - JANGKA WAKTU</h2>
          <p className="mb-4 text-justify">Perjanjian sewa menyewa ini dilangsungkan dan diterima untuk jangka waktu mulai tanggal <strong>{contract.start_date}</strong> sampai dengan tanggal <strong>{contract.end_date}</strong>.</p>

          <h2 className="font-bold mb-1 mt-4">PASAL 3 - HAK DAN KEWAJIBAN</h2>
          <div className="mb-4 text-justify pl-4">
            <p>1. PIHAK KEDUA wajib memelihara dan menjaga kebersihan serta keutuhan objek sewa dengan sebaik-baiknya.</p>
            <p>2. Segala kerusakan yang timbul akibat kelalaian PIHAK KEDUA menjadi tanggung jawab sepenuhnya dari PIHAK KEDUA.</p>
            <p>3. PIHAK KEDUA tidak diperkenankan untuk mengalihkan hak sewa atau menyewakan kembali objek sewa kepada pihak ketiga tanpa persetujuan tertulis dari PIHAK PERTAMA.</p>
          </div>

          <h2 className="font-bold mb-1 mt-4">PASAL 4 - PENYELESAIAN PERSELISIHAN</h2>
          <p className="mb-4 text-justify">Apabila terjadi perselisihan sehubungan dengan pelaksanaan perjanjian ini, maka kedua belah pihak akan menyelesaikannya secara musyawarah untuk mufakat.</p>

          <p className="mt-8 mb-4 text-justify">Demikian Surat Perjanjian ini dibuat dalam rangkap 2 (dua) yang masing-masing bermeterai cukup dan mempunyai kekuatan hukum yang sama, ditandatangani oleh kedua belah pihak dalam keadaan sadar dan tanpa paksaan dari pihak manapun.</p>

          <div className="flex justify-between mt-12 text-center">
            <div className="w-1/2">
              <p className="font-bold mb-16">PIHAK PERTAMA</p>
              <p>( Manajemen Teridox Property )</p>
            </div>
            <div className="w-1/2 flex flex-col items-center">
              <p className="font-bold mb-2">PIHAK KEDUA</p>
              <div className="border border-dashed border-slate-400 dark:border-slate-600 w-24 h-16 flex items-center justify-center text-[10px] text-slate-400 mb-2">
                METERAI<br/>Rp 10.000
              </div>
              <p>( <strong>{contract.tenant_name}</strong> )</p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={() => printContract(contract)} className="bg-td-primary hover:bg-td-primary/90 text-td-on-primary">
            <MaterialIcon name="print" className="mr-2" /> Download / Print PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
