# CLAUDE.md

Bu dosya, Claude Code'un (claude.ai/code) bu depodaki kodla çalışırken rehber olarak kullanması için hazırlanmıştır.

## Proje Özeti

Eavrasya (Türk e-ticaret) için WhatsApp'tan Shopify'a sipariş yönetim aracı olarak çalışan bir Cloudflare Worker. Uygulamanın tamamı tek bir `index.js` dosyasından (~1100 satır) oluşur ve backend API, satır içi HTML/CSS/JS frontend ve giriş sayfasını içerir.

## Mimari

**Tek dosyalı Cloudflare Worker** (`index.js`) — build adımı yok, package.json yok, bağımlılık yok (frontend'de CDN üzerinden yüklenen html2canvas hariç).

### Backend (Cloudflare Worker)
- **Kimlik Doğrulama**: `ADMIN_KEY` ortam değişkeni ile çerez tabanlı oturum. Oturum çerezi şifrenin SHA-256 hash'ini kullanır (`hashKey()`). `checkSession()` (async) her korumalı rotada doğrulama yapar.
- **Rate Limiting**: `/login` endpoint'inde IP bazlı rate limiting (5 deneme/dakika). In-memory Map ile çalışır (worker restart'ta sıfırlanır).
- **CORS**: Same-origin kontrolü — sadece aynı origin'den gelen isteklere izin verilir (`corsHeaders(request)`).
- **Rotalar**:
  - `POST /login` / `/logout` — oturum yönetimi (rate limiting korumalı)
  - `POST /analyze` — WhatsApp mesajını Claude Haiku API'ye göndererek yapılandırılmış JSON çıkarımı yapar (müşteri bilgisi, ürünler, adres doğrulama)
  - `POST /refresh-catalog` — CF Cache API'yi temizler ve Shopify ürünlerini yeniden çeker
  - `/token` — client credentials grant ile Shopify OAuth erişim token'ı alır
  - `/api/*` — Shopify Admin API'ye (`2026-01` sürümü) proxy, istemciden gelen auth token'ı iletir
  - `GET /` — oturum durumuna göre giriş HTML'i veya ana uygulama HTML'i sunar

### Frontend (Satır İçi HTML)
- İki görünüm: giriş sayfası (`getLoginHTML()`) ve ana uygulama (`getHTML(catalog, storeSlug)`)
- Ana uygulamada sekmeli arayüz: "Yeni" (yeni sipariş) ve "Geçmiş" (sipariş geçmişi)
- Akış: Shopify'a Bağlan → WhatsApp mesajını yapıştır → AI analiz eder → Formu kontrol et/düzenle → Shopify siparişi oluştur → Yanıt mesajını kopyala
- İl/ilçe/ürün açılır menüleri için özel aranabilir seçim bileşeni (`ss-wrap`/`ss-input`/`ss-list`)
- Ürün adetleri için mobil uyumlu +/− butonları (`qty-btn`) — dokunmatik ekranlarda kolay kullanım
- Türkiye il/ilçe verileri (`TURKEY_CITIES`) büyük bir sabit olarak gömülü (~80 satır)
- Mağaza slug'ı `env.STORE`'dan dinamik türetilir (hardcoded değil)
- Mobil uyumlu tasarım: `@media(max-width:480px)` ile responsive düzen, büyük dokunma alanları

### Temel Veri Akışı
1. `fetchCatalog()` → Shopify OAuth → ürünleri çek → varyantları `{variant_id, title, variant, price}` şeklinde düzleştir
2. `getCatalog()` → `fetchCatalog()` etrafında CF Cache API sarmalayıcı (1 saat TTL)
3. `buildPrompt()` → katalog + Türkiye illeri ile Claude API için sistem prompt'u oluşturur
4. `analyze` endpoint'i → Claude Haiku WhatsApp metnini ayrıştırır → müşteri, ürünler ve adres doğrulama skoru içeren yapılandırılmış JSON döndürür
5. Frontend `createOrder()` → vergi satırları (%18 KDV), indirim dağılımı ve kargo ile Shopify sipariş payload'ını oluşturur

## Güvenlik

- **XSS koruması**: `escHtml()` fonksiyonu `&`, `<`, `>`, `"`, `'` karakterlerini encode eder
- **Oturum**: Çerez değeri şifrenin SHA-256 hash'idir, şifre doğrudan çerezde tutulmaz
- **CORS**: `Access-Control-Allow-Origin: *` yerine same-origin kontrolü
- **Brute-force**: IP bazlı rate limiting (5 deneme/dakika)
- **Çerez ayarları**: `HttpOnly; Secure; SameSite=Strict`

## Ortam Değişkenleri (Sadece Cloudflare Workers Dashboard)

- `STORE` — Shopify mağaza alan adı (örn: `magaza.myshopify.com`)
- `CLIENT_ID` / `CLIENT_SECRET` — Shopify OAuth kimlik bilgileri
- `CLAUDE_KEY` — Anthropic API anahtarı
- `ADMIN_KEY` — yönetici şifresi (SHA-256 hash'lenerek oturum çerezinde kullanılır)

## Geliştirme ve Dağıtım

- **Deploy**: Tamamen otomatik — Claude `claude/` branch'ına push eder → GitHub Actions otomatik `master`'a merge eder → Cloudflare `master`'dan otomatik deploy eder (~15-20 saniye)
- **GitHub Actions**: `.github/workflows/auto-merge.yml` — `claude/**` branch'larına push geldiğinde otomatik master'a merge eder
- **Build**: Build adımı yok, `npx wrangler deploy` doğrudan çalışır
- **Konfigürasyon**: `wrangler.toml` (worker adı: `yellow-tooth-62ea`, compatibility_date: `2025-01-01`)
- **Secret'lar sadece Cloudflare Dashboard'da** tanımlıdır (GitHub Secrets'ta tutulmaz)

## Dil ve Yerelleştirme

Tüm arayüz metinleri, prompt'lar, frontend'deki değişken adları ve Claude sistem prompt'ları Türkçedir. AI prompt'u Claude'a Türkçe alan adlarıyla JSON döndürmesini söyler (`ad`, `soyad`, `telefon`, `adres1`, `ilce`, `il`, `urunler`, vb.).

## Önemli Kalıplar

- Telefon normalizasyonu: birden fazla fonksiyon Türkiye telefon formatlarını işler (0532→+90532, vb.)
- İndirim dağılımı: `buildDiscountedLineItems()` indirimi satır öğelerine orantılı olarak dağıtır, yuvarlama mantığı içerir
- Adres doğrulama: Claude `adres_kontrol` döndürür — skor (1-5), düzeltmeler, uyarılar ve öneriler
- `DEFAULT_CATALOG` sabiti, Shopify API'ye ulaşılamadığında yedek katalog olarak kullanılır
- Paket ayarı: sabit kodlanmış "3'lü Set" butonu belirli variant ID'lerini 50 TL indirimle uygular
- Kargo kuralları: `SHIPPING_RULES` dinamik kargo hesaplama (ücretsiz kargo eşiği, sabit kargo ücreti)
- Adet kontrolü: +/− butonları ile minimum 1 adet sınırı, mobilde büyük dokunma alanı (40x40px)

## Dosya Yapısı

```
├── index.js                         # Tüm uygulama (backend + frontend, ~1100 satır)
├── wrangler.toml                    # Cloudflare Worker konfigürasyonu
├── .github/workflows/auto-merge.yml # Claude branch'larını otomatik master'a merge eder
├── .gitignore                       # node_modules, .wrangler, .dev.vars, .env
└── CLAUDE.md                        # Bu dosya — Claude Code rehberi
```
