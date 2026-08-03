-- Pastikan RLS tetap aktif di tabel-tabel Anda
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

-- Tambahkan kebijakan (Policy) untuk mengizinkan operasi DELETE
CREATE POLICY "Enable delete for all users" ON tenants FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON units FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON contracts FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON billing FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON maintenance FOR DELETE USING (true);
