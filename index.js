// API anahtarlari Cloudflare Workers Environment Variables uzerinden alinir
// Dashboard: Workers > Settings > Variables > STORE, CLIENT_ID, CLIENT_SECRET, CLAUDE_KEY, ADMIN_KEY
const DEFAULT_CATALOG = [
  { variant_id: 46301891723453, title: "Gölgeli Elifba", variant: "", price: "150.00" },
  { variant_id: 46297518244029, title: "Kalem ile Yazılabilen Gölgeli Kuranı Kerim Seti", variant: "Beyaz", price: "850.00" },
  { variant_id: 46297518276797, title: "Kalem ile Yazılabilen Gölgeli Kuranı Kerim Seti", variant: "Siyah", price: "850.00" },
  { variant_id: 46301899292861, title: "Silinebilir Tükenmez Kalem – Siyah", variant: "", price: "100.00" },
];
const TURKEY_CITIES = {
  "Adana": ["Aladağ","Ceyhan","Çukurova","Feke","İmamoğlu","Karaisalı","Karataş","Kozan","Pozantı","Saimbeyli","Sarıçam","Seyhan","Tufanbeyli","Yumurtalık","Yüreğir"],
  "Adıyaman": ["Besni","Çelikhan","Gerger","Gölbaşı","Kahta","Merkez","Samsat","Sincik","Tut"],
  "Afyonkarahisar": ["Başmakçı","Bayat","Bolvadin","Çay","Çobanlar","Dazkırı","Dinar","Emirdağ","Evciler","Hocalar","İhsaniye","İscehisar","Kızılören","Merkez","Sandıklı","Sinanpaşa","Sultandağı","Şuhut"],
  "Ağrı": ["Diyadin","Doğubayazıt","Eleşkirt","Hamur","Merkez","Patnos","Taşlıçay","Tutak"],
  "Amasya": ["Göynücek","Gümüşhacıköy","Hamamözü","Merkez","Merzifon","Suluova","Taşova"],
  "Ankara": ["Akyurt","Altındağ","Ayaş","Bala","Beypazarı","Çamlıdere","Çankaya","Çubuk","Elmadağ","Etimesgut","Evren","Gölbaşı","Güdül","Haymana","Kalecik","Kahramankazan","Keçiören","Kızılcahamam","Mamak","Nallıhan","Polatlı","Pursaklar","Sincan","Şereflikoçhisar","Yenimahalle"],
  "Antalya": ["Akseki","Aksu","Alanya","Demre","Döşemealtı","Elmalı","Finike","Gazipaşa","Gündoğmuş","İbradı","Kaş","Kemer","Kepez","Konyaaltı","Korkuteli","Kumluca","Manavgat","Muratpaşa","Serik"],
  "Ardahan": ["Çıldır","Damal","Göle","Hanak","Merkez","Posof"],
  "Artvin": ["Ardanuç","Arhavi","Borçka","Hopa","Kemalpaşa","Merkez","Murgul","Şavşat","Yusufeli"],
  "Aydın": ["Bozdoğan","Buharkent","Çine","Didim","Efeler","Germencik","İncirliova","Karacasu","Karpuzlu","Koçarlı","Köşk","Kuşadası","Kuyucak","Nazilli","Söke","Sultanhisar","Yenipazar"],
  "Balıkesir": ["Altıeylül","Ayvalık","Balya","Bandırma","Bigadiç","Burhaniye","Dursunbey","Edremit","Erdek","Gömeç","Gönen","Havran","İvrindi","Karesi","Kepsut","Manyas","Marmara","Savaştepe","Sındırgı","Susurluk"],
  "Bartın": ["Amasra","Kurucaşile","Merkez","Ulus"],
  "Batman": ["Beşiri","Gercüş","Hasankeyf","Kozluk","Merkez","Sason"],
  "Bayburt": ["Aydıntepe","Demirözü","Merkez"],
  "Bilecik": ["Bozüyük","Gölpazarı","İnhisar","Merkez","Osmaneli","Pazaryeri","Söğüt","Yenipazar"],
  "Bingöl": ["Adaklı","Genç","Karlıova","Kiğı","Merkez","Solhan","Yayladere","Yedisu"],
  "Bitlis": ["Adilcevaz","Ahlat","Güroymak","Hizan","Merkez","Mutki","Tatvan"],
  "Bolu": ["Dörtdivan","Gerede","Göynük","Kıbrıscık","Mengen","Merkez","Mudurnu","Seben","Yeniçağa"],
  "Burdur": ["Ağlasun","Altınyayla","Bucak","Çavdır","Çeltikçi","Gölhisar","Karamanlı","Kemer","Merkez","Tefenni","Yeşilova"],
  "Bursa": ["Büyükorhan","Gemlik","Gürsu","Harmancık","İnegöl","İznik","Karacabey","Keles","Kestel","Mudanya","Mustafakemalpaşa","Nilüfer","Orhaneli","Orhangazi","Osmangazi","Yenişehir","Yıldırım"],
  "Çanakkale": ["Ayvacık","Bayramiç","Biga","Bozcaada","Çan","Eceabat","Ezine","Gelibolu","Gökçeada","Lapseki","Merkez","Yenice"],
  "Çankırı": ["Atkaracalar","Bayramören","Çerkeş","Eldivan","Ilgaz","Kızılırmak","Korgun","Kurşunlu","Merkez","Orta","Şabanözü","Yapraklı"],
  "Çorum": ["Alaca","Bayat","Boğazkale","Dodurga","İskilip","Kargı","Laçin","Mecitözü","Merkez","Oğuzlar","Ortaköy","Osmancık","Sungurlu","Uğurludağ"],
  "Denizli": ["Acıpayam","Babadağ","Baklan","Bekilli","Beyağaç","Bozkurt","Buldan","Çal","Çameli","Çardak","Çivril","Güney","Honaz","Kale","Merkezefendi","Pamukkale","Sarayköy","Serinhisar","Tavas"],
  "Diyarbakır": ["Bağlar","Bismil","Çermik","Çınar","Çüngüş","Dicle","Eğil","Ergani","Hani","Hazro","Kayapınar","Kocaköy","Kulp","Lice","Silvan","Sur","Yenişehir"],
  "Düzce": ["Akçakoca","Cumayeri","Çilimli","Gölyaka","Gümüşova","Kaynaşlı","Merkez","Yığılca"],
  "Edirne": ["Enez","Havsa","İpsala","Keşan","Lalapaşa","Meriç","Merkez","Süloğlu","Uzunköprü"],
  "Elazığ": ["Ağın","Alacakaya","Arıcak","Baskil","Karakoçan","Keban","Kovancılar","Maden","Merkez","Palu","Sivrice"],
  "Erzincan": ["Çayırlı","İliç","Kemah","Kemaliye","Merkez","Otlukbeli","Refahiye","Tercan","Üzümlü"],
  "Erzurum": ["Aşkale","Aziziye","Çat","Hınıs","Horasan","İspir","Karaçoban","Karayazı","Köprüköy","Narman","Oltu","Olur","Palandöken","Pasinler","Pazaryolu","Şenkaya","Tekman","Tortum","Uzundere","Yakutiye"],
  "Eskişehir": ["Alpu","Beylikova","Çifteler","Günyüzü","Han","İnönü","Mahmudiye","Mihalgazi","Mihalıççık","Odunpazarı","Sarıcakaya","Seyitgazi","Sivrihisar","Tepebaşı"],
  "Gaziantep": ["Araban","İslahiye","Karkamış","Nizip","Nurdağı","Oğuzeli","Şahinbey","Şehitkamil","Yavuzeli"],
  "Giresun": ["Alucra","Bulancak","Çamoluk","Çanakçı","Dereli","Doğankent","Espiye","Eynesil","Görele","Güce","Keşap","Merkez","Piraziz","Şebinkarahisar","Tirebolu","Yağlıdere"],
  "Gümüşhane": ["Kelkit","Köse","Kürtün","Merkez","Şiran","Torul"],
  "Hakkari": ["Çukurca","Derecik","Merkez","Şemdinli","Yüksekova"],
  "Hatay": ["Altınözü","Antakya","Arsuz","Belen","Defne","Dörtyol","Erzin","Hassa","İskenderun","Kırıkhan","Kumlu","Payas","Reyhanlı","Samandağ","Yayladağı"],
  "Iğdır": ["Aralık","Karakoyunlu","Merkez","Tuzluca"],
  "Isparta": ["Aksu","Atabey","Eğirdir","Gelendost","Gönen","Keçiborlu","Merkez","Senirkent","Sütçüler","Şarkikaraağaç","Uluborlu","Yalvaç","Yenişarbademli"],
  "İstanbul": ["Adalar","Arnavutköy","Ataşehir","Avcılar","Bağcılar","Bahçelievler","Bakırköy","Başakşehir","Bayrampaşa","Beşiktaş","Beykoz","Beylikdüzü","Beyoğlu","Büyükçekmece","Çatalca","Çekmeköy","Esenler","Esenyurt","Eyüpsultan","Fatih","Gaziosmanpaşa","Güngören","Kadıköy","Kağıthane","Kartal","Küçükçekmece","Maltepe","Pendik","Sancaktepe","Sarıyer","Silivri","Sultanbeyli","Sultangazi","Şile","Şişli","Tuzla","Ümraniye","Üsküdar","Zeytinburnu"],
  "İzmir": ["Aliağa","Balçova","Bayındır","Bayraklı","Bergama","Beydağ","Bornova","Buca","Çeşme","Çiğli","Dikili","Foça","Gaziemir","Güzelbahçe","Karabağlar","Karaburun","Karşıyaka","Kemalpaşa","Kınık","Kiraz","Konak","Menderes","Menemen","Narlıdere","Ödemiş","Seferihisar","Selçuk","Tire","Torbalı","Urla"],
  "Kahramanmaraş": ["Afşin","Andırın","Çağlayancerit","Dulkadiroğlu","Ekinözü","Elbistan","Göksun","Nurhak","Onikişubat","Pazarcık","Türkoğlu"],
  "Karabük": ["Eflani","Eskipazar","Merkez","Ovacık","Safranbolu","Yenice"],
  "Karaman": ["Ayrancı","Başyayla","Ermenek","Kazımkarabekir","Merkez","Sarıveliler"],
  "Kars": ["Akyaka","Arpaçay","Digor","Kağızman","Merkez","Sarıkamış","Selim","Susuz"],
  "Kastamonu": ["Abana","Ağlı","Araç","Azdavay","Bozkurt","Cide","Çatalzeytin","Daday","Devrekani","Doğanyurt","Hanönü","İhsangazi","İnebolu","Küre","Merkez","Pınarbaşı","Seydiler","Şenpazar","Taşköprü","Tosya"],
  "Kayseri": ["Akkışla","Bünyan","Develi","Felahiye","Hacılar","İncesu","Kocasinan","Melikgazi","Özvatan","Pınarbaşı","Sarıoğlan","Sarız","Talas","Tomarza","Yahyalı","Yeşilhisar"],
  "Kilis": ["Elbeyli","Merkez","Musabeyli","Polateli"],
  "Kırıkkale": ["Bahşili","Balışeyh","Çelebi","Delice","Karakeçili","Keskin","Merkez","Sulakyurt","Yahşihan"],
  "Kırklareli": ["Babaeski","Demirköy","Kofçaz","Lüleburgaz","Merkez","Pehlivanköy","Pınarhisar","Vize"],
  "Kırşehir": ["Akçakent","Akpınar","Boztepe","Çiçekdağı","Kaman","Merkez","Mucur"],
  "Kocaeli": ["Başiskele","Çayırova","Darıca","Derince","Dilovası","Gebze","Gölcük","İzmit","Kandıra","Karamürsel","Kartepe","Körfez"],
  "Konya": ["Ahırlı","Akören","Akşehir","Altınekin","Beyşehir","Bozkır","Cihanbeyli","Çeltik","Çumra","Derbent","Derebucak","Doğanhisar","Emirgazi","Ereğli","Güneysınır","Hadim","Halkapınar","Hüyük","Ilgın","Kadınhanı","Karapınar","Karatay","Kulu","Meram","Sarayönü","Selçuklu","Seydişehir","Taşkent","Tuzlukçu","Yalıhüyük","Yunak"],
  "Kütahya": ["Altıntaş","Aslanapa","Çavdarhisar","Domaniç","Dumlupınar","Emet","Gediz","Hisarcık","Merkez","Pazarlar","Şaphane","Simav","Tavşanlı"],
  "Malatya": ["Akçadağ","Arapgir","Arguvan","Battalgazi","Darende","Doğanşehir","Doğanyol","Hekimhan","Kale","Kuluncak","Pütürge","Yazıhan","Yeşilyurt"],
  "Manisa": ["Ahmetli","Akhisar","Alaşehir","Demirci","Gölmarmara","Gördes","Kırkağaç","Köprübaşı","Kula","Merkez","Salihli","Sarıgöl","Saruhanlı","Selendi","Soma","Şehzadeler","Turgutlu","Yunusemre"],
  "Mardin": ["Artuklu","Dargeçit","Derik","Kızıltepe","Mazıdağı","Midyat","Nusaybin","Ömerli","Savur","Yeşilli"],
  "Mersin": ["Akdeniz","Anamur","Aydıncık","Bozyazı","Çamlıyayla","Erdemli","Gülnar","Mezitli","Mut","Silifke","Tarsus","Toroslar","Yenişehir"],
  "Muğla": ["Bodrum","Dalaman","Datça","Fethiye","Kavaklıdere","Köyceğiz","Marmaris","Menteşe","Milas","Ortaca","Seydikemer","Ula","Yatağan"],
  "Muş": ["Bulanık","Hasköy","Korkut","Malazgirt","Merkez","Varto"],
  "Nevşehir": ["Acıgöl","Avanos","Derinkuyu","Gülşehir","Hacıbektaş","Kozaklı","Merkez","Ürgüp"],
  "Niğde": ["Altunhisar","Bor","Çamardı","Çiftlik","Merkez","Ulukışla"],
  "Ordu": ["Akkuş","Altınordu","Aybastı","Çamaş","Çatalpınar","Çaybaşı","Fatsa","Gölköy","Gülyalı","Gürgentepe","İkizce","Kabadüz","Kabataş","Korgan","Kumru","Mesudiye","Perşembe","Ulubey","Ünye"],
  "Osmaniye": ["Bahçe","Düziçi","Hasanbeyli","Kadirli","Merkez","Sumbas","Toprakkale"],
  "Rize": ["Ardeşen","Çamlıhemşin","Çayeli","Derepazarı","Fındıklı","Güneysu","Hemşin","İkizdere","İyidere","Kalkandere","Merkez","Pazar"],
  "Sakarya": ["Adapazarı","Akyazı","Arifiye","Erenler","Ferizli","Geyve","Hendek","Karapürçek","Karasu","Kaynarca","Kocaali","Pamukova","Sapanca","Serdivan","Söğütlü","Taraklı"],
  "Samsun": ["Alaçam","Asarcık","Atakum","Ayvacık","Bafra","Canik","Çarşamba","Havza","İlkadım","Kavak","Ladik","Ondokuzmayıs","Salıpazarı","Tekkeköy","Terme","Vezirköprü","Yakakent"],
  "Şanlıurfa": ["Akçakale","Birecik","Bozova","Ceylanpınar","Eyyübiye","Halfeti","Haliliye","Harran","Hilvan","Karaköprü","Siverek","Suruç","Viranşehir"],
  "Şırnak": ["Beytüşşebap","Cizre","Güçlükonak","İdil","Merkez","Silopi","Uludere"],
  "Siirt": ["Baykan","Eruh","Kurtalan","Merkez","Pervari","Şirvan","Tillo"],
  "Sinop": ["Ayancık","Boyabat","Dikmen","Durağan","Erfelek","Gerze","Merkez","Saraydüzü","Türkeli"],
  "Sivas": ["Akıncılar","Altınyayla","Divriği","Doğanşar","Gemerek","Gölova","Hafik","İmranlı","Kangal","Koyulhisar","Merkez","Suşehri","Şarkışla","Ulaş","Yıldızeli","Zara"],
  "Tekirdağ": ["Çerkezköy","Çorlu","Ergene","Hayrabolu","Kapaklı","Malkara","Marmaraereğlisi","Muratlı","Saray","Süleymanpaşa","Şarköy"],
  "Tokat": ["Almus","Artova","Başçiftlik","Erbaa","Niksar","Pazar","Reşadiye","Sulusaray","Merkez","Turhal","Yeşilyurt","Zile"],
  "Trabzon": ["Akçaabat","Araklı","Arsin","Beşikdüzü","Çarşıbaşı","Çaykara","Dernekpazarı","Düzköy","Hayrat","Köprübaşı","Maçka","Of","Ortahisar","Sürmene","Şalpazarı","Tonya","Vakfıkebir","Yomra"],
  "Tunceli": ["Çemişgezek","Hozat","Mazgirt","Merkez","Nazımiye","Ovacık","Pertek","Pülümür"],
  "Uşak": ["Banaz","Eşme","Karahallı","Merkez","Sivaslı","Ulubey"],
  "Van": ["Bahçesaray","Başkale","Çaldıran","Çatak","Edremit","Erciş","Gevaş","Gürpınar","İpekyolu","Muradiye","Özalp","Saray","Tuşba"],
  "Yalova": ["Altınova","Armutlu","Çınarcık","Çiftlikköy","Merkez","Termal"],
  "Yozgat": ["Akdağmadeni","Aydıncık","Boğazlıyan","Çandır","Çayıralan","Çekerek","Kadışehri","Merkez","Saraykent","Sarıkaya","Şefaatli","Sorgun","Yenifakılı","Yerköy"],
  "Zonguldak": ["Alaplı","Çaycuma","Devrek","Ereğli","Gökçebey","Kilimli","Kozlu","Merkez"]
};
const TURKEY_CITIES_JSON = JSON.stringify(TURKEY_CITIES);
function catalogToText(catalog) {
  return catalog.map(p => "ID:" + p.variant_id + " | " + p.title + (p.variant ? " (" + p.variant + ")" : "") + " | " + p.price + " TL").join("\n");
}
function buildPrompt(catalog) {
  const catalogText = catalogToText(catalog);
  return `SADECE JSON döndür. Backtick/açıklama yazma.
İL-İLÇE:${TURKEY_CITIES_JSON}
ÜRÜNLER:${catalogText}
Eşleşen→variant_id+ad'ı katalogdan AYNEN al,ürün adı UYDURMA. Renk yoksa ilk varyant. Eşleşmeyen→variant_id:null. Varsayılan:ID 46297518244029,850.00.
JSON:{"ad":"","soyad":"","telefon":"","adres1":"","ilce":"","il":"","posta_kodu":"","urunler":[{"variant_id":0,"ad":"","adet":1,"fiyat":"0.00"}],"not":"","odeme":"","adres_kontrol":{"skor":5,"durum":"basarili","duzeltmeler":[],"uyarilar":[],"oneri":{"adres1":"","ilce":"","il":""}}}
Kurallar:Tel:müşterinin verdiği numarayı AYNEN yaz,hiçbir rakam ekleme/çıkarma/değiştirme yapma.Format dönüşümü otomatik yapılacak.Adet yoksa 1.Eksik=""."havale/eft/banka"→"havale","kapıda/nakit/kapıda ödeme"→"kapida","kart/kredi kartı" veya belirsiz→"".Fiyat:Katalogdaki fiyatı AYNEN kullan,müşteri indirim istese bile fiyatı DEĞİŞTİRME,indirim talebini not alanına yaz.Ad-soyad:Birden fazla ad(örn:Halil İbrahim) veya birden fazla soyad(örn:Yılmaz Karadağ) olabilir,TAMAMINI yaz,hiçbir parça atlanmasın.Birden fazla kişi varsa TESLİMAT alıcısını müşteri olarak al.
Adres:Müşterinin verdiği detayları adres1'e tek satırda yaz.İl ve ilçeyi adres1'e YAZMA,onlar ayrı alanlarda.Hiçbir detay atlanmamalı(site adı,blok,kat,daire dahil).Sıra:Mahalle,Cadde/Sokak,No,Site/Bina/Blok,Kat,Daire.Kısaltma aç(Cad→Caddesi,Sok→Sokak,Mah→Mahallesi,Bulv→Bulvarı,Apt→Apartmanı).İl-ilçe:Müşterinin yazdığı il ve ilçeyi KORU,sadece yazım hatası düzelt,farklı ilçeyle DEĞİŞTİRME(örn:Bağcılar→Bakırköy YAPMA).İl-ilçe kataloğa göre kontrol.Yazım düzelt öner.Eksik bilgi(mahalle/sokak/bina no) uyar.Tekrar sil,büyük harf düzelt.
Skor:5=tam doğru,4=küçük düzeltme,3=eksik bilgi il/ilçe doğru,2=il-ilçe uyuşmazlığı,1=ciddi sorun.Durum:basarili/uyari/hata.Kesin hata→düzelt,kuşku→uyarı+öneri.`;
}
async function fetchCatalog(env) {
  try {
    const tr = await fetch(`https://${env.STORE}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${env.CLIENT_ID}&client_secret=${env.CLIENT_SECRET}`,
    });
    const td = await tr.json();
    if (!td.access_token) return DEFAULT_CATALOG;
    const pr = await fetch(`https://${env.STORE}/admin/api/2026-01/products.json?status=active&limit=250`, {
      headers: { "X-Shopify-Access-Token": td.access_token },
    });
    const pd = await pr.json();
    if (!pd.products) return DEFAULT_CATALOG;
    const catalog = [];
    for (const product of pd.products) {
      for (const variant of product.variants) {
        catalog.push({
          variant_id: variant.id,
          title: product.title,
          variant: variant.title !== "Default Title" ? variant.title : "",
          price: variant.price,
        });
      }
    }
    return catalog.length > 0 ? catalog : DEFAULT_CATALOG;
  } catch (e) {
    return DEFAULT_CATALOG;
  }
}
async function fetchShippingRules(env) {
  try {
    const tr = await fetch(`https://${env.STORE}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${env.CLIENT_ID}&client_secret=${env.CLIENT_SECRET}`,
    });
    const td = await tr.json();
    if (!td.access_token) return [];
    const sr = await fetch(`https://${env.STORE}/admin/api/2026-01/shipping_zones.json`, {
      headers: { "X-Shopify-Access-Token": td.access_token },
    });
    const sd = await sr.json();
    if (!sd.shipping_zones) return [];
    const rules = [];
    for (const zone of sd.shipping_zones) {
      const hasTurkey = zone.countries && zone.countries.some(c => c.code === "TR");
      if (!hasTurkey) continue;
      if (zone.price_based_shipping_rates) {
        for (const rate of zone.price_based_shipping_rates) {
          rules.push({
            name: rate.name,
            price: rate.price,
            min_order: rate.min_order_subtotal || null,
            max_order: rate.max_order_subtotal || null,
          });
        }
      }
      if (zone.weight_based_shipping_rates) {
        for (const rate of zone.weight_based_shipping_rates) {
          rules.push({
            name: rate.name,
            price: rate.price,
            min_weight: rate.weight_low || null,
            max_weight: rate.weight_high || null,
          });
        }
      }
    }
    return rules;
  } catch (e) {
    return [];
  }
}
async function getShippingRules(env) {
  const cache = caches.default;
  const cacheKey = new Request("https://shopify-api.eavrasya.com/__shipping_rules");
  const cached = await cache.match(cacheKey);
  if (cached) return await cached.json();
  const rules = await fetchShippingRules(env);
  await cache.put(cacheKey, new Response(JSON.stringify(rules), {
    headers: { "Content-Type": "application/json", "Cache-Control": "max-age=3600" },
  }));
  return rules;
}
async function getCatalog(env) {
  const cache = caches.default;
  const cacheKey = new Request("https://shopify-api.eavrasya.com/__catalog");
  const cached = await cache.match(cacheKey);
  if (cached) return await cached.json();
  const catalog = await fetchCatalog(env);
  await cache.put(cacheKey, new Response(JSON.stringify(catalog), {
    headers: { "Content-Type": "application/json", "Cache-Control": "max-age=3600" },
  }));
  return catalog;
}
async function hashKey(key) {
  const data = new TextEncoder().encode(key);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function checkSession(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  const expected = await hashKey(env.ADMIN_KEY);
  return match[1] === expected;
}
const loginAttempts = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now - record.first > 60000) { loginAttempts.delete(ip); return true; }
  return record.count < 5;
}
function recordAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.first > 60000) { loginAttempts.set(ip, { count: 1, first: now }); }
  else { record.count++; }
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request) });
    }
    if (path === "/login" && request.method === "POST") {
      const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
      if (!checkRateLimit(clientIP)) {
        return new Response('{"error":"Çok fazla deneme. Lütfen 1 dakika bekleyin."}', { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60", ...corsHeaders(request) } });
      }
      recordAttempt(clientIP);
      const { password } = await request.json();
      if (password === env.ADMIN_KEY) {
        const sessionToken = await hashKey(env.ADMIN_KEY);
        return new Response('{"ok":true}', {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`,
            ...corsHeaders(request)
          }
        });
      }
      return new Response('{"error":"Yanlis sifre"}', { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
    }
    if (path === "/logout") {
      return new Response('{"ok":true}', {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
          ...corsHeaders(request)
        }
      });
    }
    if (path === "/token") {
      if (!await checkSession(request, env)) {
        return new Response('{"error":"Yetkisiz erisim"}', { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      }
      try {
        const storeUrl = `https://${env.STORE}/admin/oauth/access_token`;
        const r = await fetch(storeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=client_credentials&client_id=${env.CLIENT_ID}&client_secret=${env.CLIENT_SECRET}`,
        });
        const text = await r.text();
        if (!r.ok) {
          return new Response(JSON.stringify({ error: `Shopify hata: ${r.status}`, detail: text, store: env.STORE }), { status: r.status, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
        }
        return new Response(text, { headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      } catch (e) {
        return new Response(JSON.stringify({ error: `Baglanti hatasi: ${e.message}`, store: env.STORE }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      }
    }
    if (path === "/refresh-catalog" && request.method === "POST") {
      if (!await checkSession(request, env)) {
        return new Response('{"error":"Yetkisiz erisim"}', { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      }
      const cache = caches.default;
      await cache.delete(new Request("https://shopify-api.eavrasya.com/__catalog"));
      await cache.delete(new Request("https://shopify-api.eavrasya.com/__shipping_rules"));
      const catalog = await fetchCatalog(env);
      const shippingRules = await fetchShippingRules(env);
      await cache.put(new Request("https://shopify-api.eavrasya.com/__catalog"), new Response(JSON.stringify(catalog), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=3600" },
      }));
      await cache.put(new Request("https://shopify-api.eavrasya.com/__shipping_rules"), new Response(JSON.stringify(shippingRules), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=3600" },
      }));
      return new Response(JSON.stringify({ ok: true, count: catalog.length, products: catalog, shipping_rules: shippingRules }), { headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
    }
    if (path === "/analyze" && request.method === "POST") {
      if (!await checkSession(request, env)) {
        return new Response('{"error":"Yetkisiz erisim"}', { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      }
      const { message } = await request.json();
      if (!message) return new Response('{"error":"message gerekli"}', { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      try {
        const catalog = await getCatalog(env);
        const prompt = buildPrompt(catalog);
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.CLAUDE_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-beta": "prompt-caching-2024-07-31",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            system: [{ type: "text", text: prompt, cache_control: { type: "ephemeral" } }],
            messages: [{ role: "user", content: message }],
          }),
        });
        const d = await r.json();
        if (d.error) return new Response(JSON.stringify({ error: d.error.message }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
        const txt = d.content?.[0]?.text || "";
        let clean = txt.replace(/```json|```/g, "").trim();
        const fi = clean.indexOf("{"), li = clean.lastIndexOf("}");
        if (fi !== -1 && li > fi) clean = clean.substring(fi, li + 1);
        try {
          JSON.parse(clean);
          return new Response(clean, { headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
        } catch {
          return new Response(JSON.stringify({ error: "JSON parse hatasi", raw: txt.substring(0, 300) }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      }
    }
    if (path.startsWith("/api/")) {
      if (!await checkSession(request, env)) {
        return new Response('{"error":"Yetkisiz erisim"}', { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      }
      const shopifyPath = path.replace("/api/", "");
      const token = request.headers.get("Authorization");
      if (!token) return new Response('{"error":"Token gerekli"}', { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
      const opts = { method: request.method, headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token } };
      if (request.method === "POST" || request.method === "PUT") opts.body = await request.text();
      const r = await fetch(`https://${env.STORE}/admin/api/2026-01/${shopifyPath}`, opts);
      return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json", ...corsHeaders(request) } });
    }
    if (!await checkSession(request, env)) {
      return new Response(getLoginHTML(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    const catalog = await getCatalog(env);
    const shippingRules = await getShippingRules(env);
    const storeSlug = (env.STORE || "").replace(".myshopify.com", "");
    return new Response(getHTML(catalog, storeSlug, shippingRules), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
};
function corsHeaders(request) {
  const origin = request ? (request.headers.get("Origin") || "") : "";
  const allowed = origin && new URL(request.url).origin === origin;
  return { "Access-Control-Allow-Origin": allowed ? origin : "null", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
}
function getHTML(catalog, storeSlug, shippingRules) {
  const catalogJSON = JSON.stringify(catalog);
  const storeSlugJSON = JSON.stringify(storeSlug || "");
  const shippingRulesJSON = JSON.stringify(shippingRules || []);
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>WhatsApp Siparis | Eavrasya</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2325D366'/%3E%3Cstop offset='100%25' stop-color='%23128C7E'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cpath d='M16 6c-5.5 0-10 3.9-10 8.7 0 2.7 1.5 5.2 3.9 6.8L9 25l3.8-2c1 .3 2.1.4 3.2.4 5.5 0 10-3.9 10-8.7S21.5 6 16 6z' fill='rgba(255,255,255,0.25)'/%3E%3Cpath d='M14 12h4l1 4h-2v3h-2v-3h-2l1-4z' fill='white'/%3E%3C/svg%3E">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#0c0e14;color:#d1d5db;min-height:100vh;padding:14px;overflow-x:hidden}
.wrap{max-width:620px;margin:0 auto}
.hdr{display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1a1d27}
.logo{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#25D366,#128C7E);display:flex;align-items:center;justify-content:center;font-size:18px}
.hdr-title{font-size:17px;font-weight:700;color:#f0f0f0}
.hdr-sub{font-size:11px;color:#555}
.tabs{display:flex;gap:4px;margin-left:auto}
.tab{padding:5px 12px;background:transparent;border:none;border-radius:6px;color:#555;font-size:12px;cursor:pointer}
.tab.active{background:#1a1d27;color:#f0f0f0;font-weight:600}
.card{background:#111318;border:1px solid #1a1d27;border-radius:10px;padding:16px;margin-bottom:12px}
.step{display:flex;align-items:center;gap:7px;margin-bottom:10px;font-size:13px;font-weight:600;color:#e5e7eb}
.badge{width:20px;height:20px;border-radius:5px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff}
.sec{font-size:11px;color:#4b5563;font-weight:600;margin-bottom:6px;text-transform:uppercase;letter-spacing:.3px}
.lbl{font-size:10px;color:#4b5563;margin-bottom:3px;display:block}
.inp{width:100%;padding:7px 9px;background:#0c0e14;border:1px solid #1a1d27;border-radius:5px;color:#f0f0f0;font-size:16px;outline:none}
.inp:focus{border-color:#25D366}
select.inp{cursor:pointer}
.ss-wrap{position:relative}.ss-input{width:100%;padding:7px 9px;background:#0c0e14;border:1px solid #1a1d27;border-radius:5px;color:#f0f0f0;font-size:16px;outline:none;cursor:pointer;box-sizing:border-box}.ss-input:focus{border-color:#25D366}.ss-input::placeholder{color:#4b5563}.ss-list{display:none;position:absolute;top:100%;left:0;right:0;max-height:200px;overflow-y:auto;background:#1a1d27;border:1px solid #25D366;border-top:none;border-radius:0 0 7px 7px;z-index:100}.ss-list.open{display:block}.ss-item{padding:8px 10px;color:#d1d5db;cursor:pointer;font-size:14px}.ss-item:hover{background:rgba(37,211,102,.2);color:#fff}.ss-item.sel{background:rgba(37,211,102,.15);color:#34d399}.ss-item.hidden{display:none}
.ta{width:100%;min-height:110px;padding:10px;background:#0c0e14;border:1px solid #1a1d27;border-radius:7px;color:#f0f0f0;font-size:16px;line-height:1.6;resize:vertical;outline:none;font-family:inherit;margin-bottom:8px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.grid-half{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.mt{margin-top:7px}
.btn{padding:9px 20px;background:linear-gradient(135deg,#25D366,#128C7E);border:none;border-radius:7px;color:#fff;font-size:13px;font-weight:600;cursor:pointer}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn-big{width:100%;padding:14px;font-size:15px;font-weight:700;border-radius:10px}
.btn-out{padding:7px 14px;background:transparent;border:1px solid #1a1d27;border-radius:6px;color:#9ca3af;font-size:12px;cursor:pointer}
.btn-del{width:24px;height:24px;background:transparent;border:1px solid rgba(239,68,68,.2);border-radius:4px;color:#ef4444;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.err{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.1);border-radius:7px;padding:9px 12px;margin-bottom:10px;font-size:12px;color:#fca5a5}
.token-bar{display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:7px 12px;background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.12);border-radius:7px;font-size:12px;flex-wrap:wrap}
.sm{padding:3px 10px;background:rgba(255,255,255,.05);border:1px solid #1a1d27;border-radius:4px;color:#888;font-size:11px;cursor:pointer;margin-left:auto}
.product-card{margin-bottom:8px;padding:10px;background:#0c0e14;border-radius:7px}
.product-card.matched{border:1px solid rgba(52,211,153,.2)}
.product-card.manual{border:1px solid rgba(239,68,68,.2)}
.tag{font-size:10px;padding:1px 6px;border-radius:3px;font-weight:600}
.tag.ok{background:rgba(52,211,153,.15);color:#34d399}
.tag.no{background:rgba(239,68,68,.15);color:#fca5a5}
.pay-row{display:flex;gap:8px;margin-bottom:16px}
.pay-btn{flex:1;padding:12px;border-radius:8px;font-size:13px;cursor:pointer;text-align:center;background:#0c0e14;border:1px solid #1a1d27;color:#6b7280}
.pay-btn.active-blue{background:rgba(59,130,246,.13);border:2px solid #3b82f6;color:#3b82f6;font-weight:600}
.pay-btn.active-yellow{background:rgba(245,158,11,.13);border:2px solid #f59e0b;color:#f59e0b;font-weight:600}
.total-bar{background:#0c0e14;border-radius:8px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;font-size:15px}
.hidden{display:none}
.bundle-bar{display:flex;gap:6px;margin-bottom:8px}
.bundle-btn{flex:1;padding:8px;background:rgba(59,130,246,.08);border:1px dashed #3b82f6;border-radius:6px;color:#60a5fa;font-size:11px;cursor:pointer;text-align:center;font-weight:600}
.bundle-btn:hover{background:rgba(59,130,246,.15)}
.qty-btn{width:36px;height:36px;background:#1a1d27;border:1px solid #2a2d37;border-radius:6px;color:#f0f0f0;font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.qty-btn:active{background:#25D366;color:#fff}
.qty-inp{width:48px;text-align:center;-moz-appearance:textfield;padding:7px 4px}
.qty-inp::-webkit-outer-spin-button,.qty-inp::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.discount-row{display:flex;gap:6px;align-items:center;margin-bottom:10px}
.discount-row .inp{width:100px}
.discount-row select{width:60px;padding:7px 4px;background:#0c0e14;border:1px solid #1a1d27;border-radius:5px;color:#f0f0f0;font-size:16px}
.discount-info{font-size:12px;color:#f59e0b;font-weight:600}
.addr-check{border-radius:7px;padding:9px 12px;margin-bottom:10px;font-size:12px}
.addr-check.ok{background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.15);color:#34d399}
.addr-check.warn{background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);color:#fbbf24}
.addr-check.bad{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);color:#fca5a5}
.addr-check .title{font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:5px}
.addr-check .fixes{margin-top:4px}
.addr-check .fix-item{display:flex;align-items:center;gap:4px;padding:2px 0;font-size:11px;flex-wrap:wrap}
.addr-check .warn-item{display:flex;align-items:center;gap:4px;padding:2px 0;font-size:11px}
.addr-fix-btn{padding:2px 8px;background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);border-radius:4px;color:#fbbf24;font-size:10px;cursor:pointer;font-weight:600;margin-left:4px}
.addr-fix-btn:hover{background:rgba(245,158,11,.25)}
@keyframes checkPop{0%{transform:scale(0) rotate(-45deg);opacity:0}50%{transform:scale(1.2) rotate(0deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes confettiDrop{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(60px) rotate(360deg)}}
.order-summary{background:#fff;border-radius:16px;padding:0;margin-bottom:14px;color:#1a1a1a;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.os-header{background:linear-gradient(135deg,#0d7a6e 0%,#128C7E 30%,#25D366 100%);padding:28px 20px 24px;text-align:center;position:relative;overflow:hidden}
.os-confetti{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;overflow:hidden}
.os-confetti span{position:absolute;top:-8px;width:8px;height:8px;border-radius:2px;animation:confettiDrop 1.5s ease-out forwards}
.os-check-wrap{animation:checkPop .5s cubic-bezier(.34,1.56,.64,1) .1s both}
.os-header .check{width:56px;height:56px;background:rgba(255,255,255,.25);backdrop-filter:blur(4px);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:10px;box-shadow:0 4px 16px rgba(0,0,0,.1)}
.os-header h2{color:#fff;font-size:19px;margin-bottom:4px;font-weight:700;animation:fadeUp .4s ease .3s both}
.os-header p{color:rgba(255,255,255,.9);font-size:13px;font-weight:500;animation:fadeUp .4s ease .4s both}
.os-order-no{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#f0faf8;border-bottom:2px solid #e0f2ee;animation:fadeUp .4s ease .35s both}
.os-order-label{font-size:12px;color:#555;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.os-order-value{font-size:18px;font-weight:800;color:#128C7E;letter-spacing:.5px}
.os-body{padding:20px}
.os-section{margin-bottom:18px;animation:fadeUp .4s ease both}
.os-section:nth-child(1){animation-delay:.3s}
.os-section:nth-child(2){animation-delay:.4s}
.os-section:nth-child(3){animation-delay:.5s}
.os-section:nth-child(4){animation-delay:.6s}
.os-section-title{font-size:11px;color:#128C7E;font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid #e8f5f3;display:flex;align-items:center;gap:6px}
.os-section-title::before{content:"";display:inline-block;width:3px;height:12px;background:#128C7E;border-radius:2px}
.os-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:#555}
.os-row.bold{font-weight:600;color:#1a1a1a;font-size:14px}
.os-product{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;margin-bottom:4px;background:#f8fafb;border-radius:10px;border:1px solid #eef2f5;transition:background .2s}
.os-product:last-child{margin-bottom:0}
.os-product .name{font-size:13px;color:#1a1a1a;font-weight:600}
.os-product .qty{font-size:12px;color:#888;margin-top:2px}
.os-product .price{font-size:14px;font-weight:700;color:#128C7E;white-space:nowrap}
.os-total{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-radius:12px;margin-top:10px;font-size:17px;font-weight:800;color:#fff;background:linear-gradient(135deg,#128C7E,#25D366);box-shadow:0 2px 12px rgba(18,140,126,.25)}
.os-payment{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:24px;font-size:13px;font-weight:600}
.os-payment.cod{background:linear-gradient(135deg,#FFF8E1,#FFF3CD);color:#7c6b1f;border:1px solid #f0e4a6}
.os-payment.eft{background:linear-gradient(135deg,#E0F4F7,#D1ECF1);color:#0a5460;border:1px solid #b8dce3}
.os-footer{text-align:center;padding:14px 20px 18px;font-size:11px;color:#bbb;border-top:1px solid #f0f0f0;background:linear-gradient(to right,transparent,#f8f8f8,transparent);background-size:200% 100%;animation:shimmer 3s ease-in-out infinite}
.os-actions{display:flex;gap:10px;justify-content:center;padding:0 0 12px;flex-wrap:wrap;animation:fadeUp .4s ease .7s both}
.os-actions .btn{padding:12px 28px;border-radius:12px;font-weight:600;transition:all .2s}
.os-actions a{display:inline-flex;align-items:center;text-decoration:none;color:#128C7E;padding:12px 20px;border:2px solid #128C7E;border-radius:12px;font-size:13px;font-weight:600;transition:all .2s}
.os-actions a:hover{background:#128C7E;color:#fff}
.os-info-row{display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px;color:#555}
.os-info-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0}
.os-info-text{flex:1}
.os-info-text.bold{font-weight:600;color:#1a1a1a;font-size:14px}
.os-wa-section{margin-bottom:0!important}
.os-wa-inline{background:#005c4b;color:#e9edef;padding:12px 16px;border-radius:12px;font-size:14px;line-height:1.7;outline:none;cursor:text}
.os-btn-bar{display:flex;gap:8px;margin-bottom:10px;animation:fadeUp .4s ease .7s both}
.os-btn-bar .btn{padding:12px;border-radius:10px;font-size:13px}
.history-item{padding:12px 14px;background:rgba(12,14,20,.5);border-radius:10px;margin-bottom:6px;border:1px solid rgba(255,255,255,.03)}
.history-item .top{display:flex;justify-content:space-between;align-items:center}
.history-item b{color:#e5e7eb;font-size:13px}
.history-item .link{margin-left:8px;font-size:11px;color:#34d399;text-decoration:none}
.history-item .time{font-size:11px;color:#555}
.history-item .detail{font-size:12px;color:#6b7280;margin-top:3px}
.pay-tag{margin-left:8px;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600}
.pay-tag.cod{background:rgba(245,158,11,.15);color:#fbbf24}
.pay-tag.eft{background:rgba(59,130,246,.15);color:#60a5fa}
@media(max-width:480px){body{padding:8px}.wrap{max-width:100%}.hdr-title{font-size:15px}.hdr-sub{font-size:10px}.tab{padding:4px 8px;font-size:11px}.card{padding:12px}.grid{grid-template-columns:1fr}.logo{width:34px;height:34px;font-size:16px;border-radius:10px}.badge{width:22px;height:22px}.btn-big{padding:12px;font-size:14px}.pay-btn{padding:12px;font-size:12px}.bundle-btn{font-size:10px;padding:6px}.discount-row .inp{width:70px}.discount-row select{width:50px}.os-header{padding:16px}.os-header h2{font-size:16px}.os-order-no{padding:10px 14px}.os-order-value{font-size:15px}.os-body{padding:14px}.os-actions .btn{padding:8px 16px;font-size:12px}.os-actions a{padding:8px 12px;font-size:12px}.os-btn-bar .btn{padding:9px;font-size:12px}.sm{font-size:10px;padding:3px 7px}.token-bar{gap:5px;padding:5px 8px;font-size:11px}.ss-list{max-height:150px}.ss-item{padding:8px 10px;font-size:13px}.tag{padding:2px 8px;font-size:9px}.product-card{padding:10px}.hdr{padding-bottom:10px;margin-bottom:12px}.qty-btn{width:40px;height:40px;font-size:20px}.qty-inp{width:44px;font-size:16px}}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <div class="logo">💬</div>
    <div style="flex:1"><div class="hdr-title">WhatsApp → Shopify</div><div class="hdr-sub">Eavrasya · Tek Tıkla Sipariş</div></div>
    <div class="tabs">
      <button class="tab active" id="tabNew" onclick="switchTab('new')">Yeni</button>
      <button class="tab" id="tabList" onclick="switchTab('list')">Geçmiş (<span id="histCount">0</span>)</button>
    </div>
  </div>
  <div id="errBox" class="err hidden"></div>
  <div id="viewNew">
    <div id="connectCard" class="card">
      <button class="btn btn-big" id="connectBtn" onclick="connect()">🔗 Shopify'a Bağlan</button>
    </div>
    <div id="connectedBar" class="token-bar hidden">
      <span style="color:#34d399">✅ Shopify bağlı</span>
      <button class="sm" onclick="disconnect()">Bağlantıyı Kes</button>
      <button class="sm" onclick="refreshCatalog()">↻ Katalog Yenile</button>
      <button class="sm" onclick="logout()" style="color:#ef4444;border-color:rgba(239,68,68,.3)">Çıkış Yap</button>
    </div>
    <div id="step1" class="card hidden">
      <div class="step"><span class="badge" style="background:#25D366">1</span> WhatsApp Mesajı</div>
      <textarea class="ta" id="msgInput" placeholder="Müşterinin WhatsApp mesajını buraya yapıştır..."></textarea>
      <button class="btn" id="analyzeBtn" onclick="analyze()">🤖 Mesajı Analiz Et</button>
    </div>
    <div id="step2" class="card hidden">
      <div class="step"><span class="badge" style="background:#f59e0b">2</span> Kontrol Et</div>
      <div class="sec">👤 müşteri</div>
      <div class="grid-half">
        <div><label class="lbl">Ad</label><input class="inp" id="fAd"></div>
        <div><label class="lbl">Soyad</label><input class="inp" id="fSoyad"></div>
      </div>
      <div class="mt"><label class="lbl">Telefon</label><input class="inp" id="fTel" type="tel" placeholder="+905xxxxxxxxx" oninput="validatePhone()" onblur="normalizePhone()"></div>
      <div id="phoneCheckBox"></div>
      <div class="sec" style="margin-top:14px">📦 adres</div>
      <div id="addrCheckBox"></div>
      <div><label class="lbl">Adres</label><textarea class="ta" id="fAdres1" rows="2" style="min-height:50px;margin-bottom:0"></textarea></div>
      <div class="grid-half mt">
        <div><label class="lbl">İlçe</label><div class="ss-wrap"><input class="ss-input" id="fIlce" placeholder="İlçe ara..." data-value="" onclick="openSS(this)" oninput="filterSS(this)" autocomplete="off"><div class="ss-list" id="fIlce_list"></div></div></div>
        <div><label class="lbl">İl</label><div class="ss-wrap"><input class="ss-input" id="fIl" placeholder="İl ara..." data-value="" onclick="openSS(this)" oninput="filterSS(this)" autocomplete="off"><div class="ss-list" id="fIl_list"></div></div></div>
      </div>
      <div class="mt"><label class="lbl">Not</label><input class="inp" id="fNot"></div>
      <div class="sec" style="margin-top:14px">📚 ürünler</div>
      <div class="bundle-bar"><button class="bundle-btn" onclick="applyBundle()">📦 3'lü Set — 1.050 TL (%5 indirim)</button></div>
      <div id="productList"></div>
      <button class="btn-out" style="border-style:dashed;font-size:11px;width:100%;margin-top:4px" onclick="addProduct()">+ Ürün Ekle</button>
      <div class="sec" style="margin-top:16px">💳 ödeme yöntemi</div>
      <div class="pay-row">
        <button class="pay-btn active-blue" id="payEft" onclick="setPayment('eft')">🏦 Havale/EFT</button>
        <button class="pay-btn" id="payCod" onclick="setPayment('cod')">🚚 Kapıda Ödeme</button>
      </div>
      <div class="discount-row"><label class="lbl" style="margin:0;white-space:nowrap">İndirim:</label><input class="inp" id="fDiscount" type="number" placeholder="0" value="0" oninput="updateTotal()"><select id="fDiscountType" onchange="updateTotal()"><option value="tl">TL</option><option value="pct">%</option></select><span class="discount-info" id="discountInfo"></span></div>
      <div id="shippingInfo" style="background:#0c0e14;border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:13px"></div>
      <div class="total-bar">
        <span style="color:#9ca3af">Toplam:</span>
        <span id="totalPrice" style="color:#f0f0f0;font-weight:700">0.00 TL</span>
      </div>
      <button class="btn btn-big" id="createBtn" onclick="createOrder()">🚀 Sipariş Oluştur</button>
    </div>
    <div id="successCard" class="hidden">
      <div class="order-summary" id="orderSummary">
        <div class="os-header">
          <div class="os-confetti" id="confettiBox"></div>
          <div class="os-check-wrap"><div class="check">✓</div></div>
          <h2>Siparişiniz Onaylandı!</h2>
          <p id="sucDate"></p>
        </div>
        <div class="os-order-no">
          <span class="os-order-label">Sipariş Numarası</span>
          <span class="os-order-value" id="sucOrderName"></span>
        </div>
        <div class="os-body">
          <div class="os-section">
            <div class="os-section-title">Sipariş Detayları</div>
            <div id="sucProducts"></div>
            <div class="os-row" style="padding-top:8px"><span>Nakliye</span><span id="sucShipping" style="font-weight:600"></span></div>
            <div class="os-total"><span>Toplam</span><span id="sucTotal"></span></div>
          </div>
          <div class="os-section">
            <div class="os-section-title">Teslimat Bilgileri</div>
            <div class="os-info-row"><span class="os-info-icon">👤</span><span class="os-info-text bold" id="sucCustomer"></span></div>
            <div class="os-info-row"><span class="os-info-icon">📞</span><span class="os-info-text" id="sucPhone"></span></div>
            <div class="os-info-row"><span class="os-info-icon">📍</span><span class="os-info-text" id="sucAddress"></span></div>
            <div class="os-info-row"><span class="os-info-icon">🏙️</span><span class="os-info-text" id="sucCity"></span></div>
          </div>
          <div class="os-section">
            <div class="os-section-title">Ödeme Yöntemi</div>
            <span class="os-payment" id="sucPayment"></span>
          </div>
          <div class="os-section" id="sucNoteSection">
            <div class="os-section-title">Sipariş Notu</div>
            <div class="os-info-row"><span class="os-info-icon">📝</span><span class="os-info-text" id="sucNote"></span></div>
          </div>
          <div class="os-section os-wa-section">
            <div class="os-section-title">WhatsApp Yanıtı</div>
            <div id="sucReply" contenteditable="true" class="os-wa-inline"></div>
          </div>
        </div>
        <div class="os-footer">Eavrasya · eavrasya.com</div>
      </div>
      <div class="os-btn-bar">
        <button class="btn" onclick="copyScreenshot()" id="copyScreenBtn" style="flex:1">📸 Görüntü Paylaş</button>
        <button class="btn" onclick="copyReply()" id="copyReplyBtn" style="flex:1">📋 Mesajı Kopyala</button>
      </div>
      <div class="os-actions">
        <button class="btn" onclick="resetOrder()">📝 Yeni Sipariş</button>
        <a id="sucLink" href="#" target="_blank">🔗 Shopify'da Aç</a>
      </div>
    </div>
  </div>
  <div id="viewList" class="hidden">
    <div class="card" id="historyList"><div style="text-align:center;color:#4b5563;padding:20px">Henüz sipariş yok</div></div>
  </div>
</div>
<script>
var CATALOG=${catalogJSON};
var STORE_SLUG=${storeSlugJSON};
var SHIPPING_RULES=${shippingRulesJSON};
var TURKEY_CITIES_FE=${JSON.stringify(TURKEY_CITIES)};
var token="",parsed=null,payment="eft",orderHistory=[];
function $(id){return document.getElementById(id)}
function show(id){$(id).classList.remove("hidden")}
function hide(id){$(id).classList.add("hidden")}
function showErr(m){$("errBox").textContent=m;show("errBox")}
function hideErr(){hide("errBox")}
function escHtml(s){if(!s)return"";return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function switchTab(t){
  if(t==="new"){show("viewNew");hide("viewList");$("tabNew").className="tab active";$("tabList").className="tab"}
  else{hide("viewNew");show("viewList");$("tabList").className="tab active";$("tabNew").className="tab"}
}
async function connect(){
  $("connectBtn").disabled=true;hideErr();
  try{var r=await fetch("/token");var d=await r.json();
    if(d.access_token){token=d.access_token;hide("connectCard");show("connectedBar");show("step1");populateIlSelect()}
    else throw new Error(JSON.stringify(d));
  }catch(e){showErr("Baglanti hatasi: "+e.message)}
  $("connectBtn").disabled=false;
}
function disconnect(){token="";parsed=null;show("connectCard");hide("connectedBar");hide("step1");hide("step2");hide("successCard")}
function openSS(inp){
  inp.removeAttribute("readonly");
  inp.select();
  var list=inp.nextElementSibling;
  document.querySelectorAll(".ss-list.open").forEach(function(l){if(l!==list)l.classList.remove("open")});
  list.classList.add("open");
  var items=list.querySelectorAll(".ss-item");
  items.forEach(function(it){it.classList.remove("hidden")});
}
function trLower(s){return s.toLocaleLowerCase("tr").replace(/ı/g,"i")}
function filterSS(inp){
  var q=trLower(inp.value);
  var list=inp.nextElementSibling;
  list.classList.add("open");
  list.querySelectorAll(".ss-item").forEach(function(it){
    var txt=trLower(it.textContent);
    if(txt.indexOf(q)!==-1)it.classList.remove("hidden");
    else it.classList.add("hidden");
  });
}
function selectSS(inp,val,label,cb){
  inp.value=label;
  inp.setAttribute("data-value",val);
  inp.nextElementSibling.classList.remove("open");
  if(cb)cb(val);
}
function closeSS(inp){
  if(!inp)return;
  var dv=inp.getAttribute("data-value");
  if(!inp.value&&dv){inp.value="";inp.setAttribute("data-value","");}
  inp.nextElementSibling.classList.remove("open");
}
document.addEventListener("click",function(e){
  if(!e.target.closest(".ss-wrap")){document.querySelectorAll(".ss-list.open").forEach(function(l){l.classList.remove("open")})}
});
function populateIlSelect(){
  var list=$("fIl_list");
  list.innerHTML="";
  Object.keys(TURKEY_CITIES_FE).sort(function(a,b){return a.localeCompare(b,"tr")}).forEach(function(il){
    var d=document.createElement("div");d.className="ss-item";d.textContent=il;d.setAttribute("data-val",il);
    d.onclick=function(){selectSS($("fIl"),il,il,function(){populateIlceSelect(il);$("fIlce").value="";$("fIlce").setAttribute("data-value","");validateCityDistrict()})};
    list.appendChild(d);
  });
}
function populateIlceSelect(ilKey){
  var list=$("fIlce_list");
  list.innerHTML="";
  if(ilKey&&TURKEY_CITIES_FE[ilKey]){
    TURKEY_CITIES_FE[ilKey].forEach(function(ilce){
      var d=document.createElement("div");d.className="ss-item";d.textContent=ilce;d.setAttribute("data-val",ilce);
      d.onclick=function(){selectSS($("fIlce"),ilce,ilce,function(){validateCityDistrict()})};
      list.appendChild(d);
    });
  }
}
function onIlChange(){
  var il=$("fIl").value;
  populateIlceSelect(il);
  validateCityDistrict();
}
async function refreshCatalog(){
  hideErr();
  try{
    var r=await fetch("/refresh-catalog",{method:"POST"});
    var d=await r.json();
    if(d.ok){CATALOG=d.products;if(d.shipping_rules)SHIPPING_RULES=d.shipping_rules;showErr("Katalog guncellendi: "+d.count+" urun");setTimeout(hideErr,3000)}
    else{showErr("Katalog hatasi: "+(d.error||"bilinmeyen"))}
  }catch(e){showErr("Katalog hatasi: "+e.message)}
}
async function logout(){await fetch("/logout");location.reload()}
async function analyze(){
  var msg=$("msgInput").value.trim();if(!msg)return;
  $("analyzeBtn").disabled=true;hideErr();hide("step2");hide("successCard");
  try{var r=await fetch("/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg})});
    var d=await r.json();if(d.error)throw new Error(d.error);
    parsed=d;
    var rawPhone=extractRawPhone(msg);
    if(rawPhone&&parsed.telefon){var rc=phoneCore(rawPhone),ac=phoneCore(parsed.telefon);if(rc!==ac)parsed.telefon=rawPhone;}
    if(parsed.urunler){var unmatchedItems=[];parsed.urunler.forEach(function(u){if(u.variant_id){u.variant_id=Number(u.variant_id);var cat=CATALOG.find(function(c){return c.variant_id===u.variant_id});if(cat){u.ad=cat.title+(cat.variant?" ("+cat.variant+")":"");u.fiyat=cat.price;}else{unmatchedItems.push(u.ad||"Bilinmeyen");u.variant_id=null;}}else{unmatchedItems.push(u.ad||"Bilinmeyen");}});if(unmatchedItems.length)showErr("⚠️ Katalogda eşleşmeyen ürün: "+unmatchedItems.join(", ")+" — Lütfen katalogdan manuel seçin");}
    if(parsed.odeme==="havale")setPayment("eft");
    else if(parsed.odeme==="kapida")setPayment("cod");
    else setPayment("cod");
    fillForm();show("step2");
  }catch(e){showErr("Analiz hatasi: "+e.message)}
  $("analyzeBtn").disabled=false;
}
function validateCityDistrict(){
  var il=$("fIl").value;
  var ilce=$("fIlce").value;
  var box=$("addrCheckBox");
  if(!il&&!ilce){box.innerHTML="";return;}
  if(!il){box.innerHTML='<div class="addr-check warn"><div class="title">⚠️ İl seçilmedi</div></div>';return;}
  if(!ilce){box.innerHTML='<div class="addr-check ok"><div class="title">✅ '+escHtml(il)+' seçildi — İlçe seçin</div></div>';return;}
  box.innerHTML='<div class="addr-check ok"><div class="title">✅ '+escHtml(il)+' / '+escHtml(ilce)+' doğrulandı</div></div>';
}
function extractRawPhone(msg){
  var phoneRx=/(?:\\+90[\\s\\-\\(\\)]*|0090[\\s\\-\\(\\)]*|0[\\s\\-\\(\\)]*)?5\\d{2}[\\s\\-\\(\\)]*\\d{3}[\\s\\-\\(\\)]*\\d{0,2}[\\s\\-\\(\\)]*\\d{0,2}/;
  var body=msg.replace(/\\[\\d{2}[.:]\\d{2},?\\s*\\d{2}\\.\\d{2}\\.\\d{4}\\]\\s*\\+?\\d[\\d\\s\\-\\(\\)]*:/g,"");
  var m=body.match(phoneRx);
  if(m)return m[0].replace(/[\\s\\-\\(\\)]/g,"");
  m=msg.match(phoneRx);
  if(!m)return null;
  return m[0].replace(/[\\s\\-\\(\\)]/g,"");
}
function phoneCore(p){
  var d=p.replace(/[^\\d]/g,"");
  if(d.match(/^0090[5]/))return d.substring(4);
  if(d.match(/^90[5]/))return d.substring(2);
  if(d.match(/^0[5]/))return d.substring(1);
  return d;
}
function normalizePhone(){
  var v=$("fTel").value.replace(/[\\s\\-\\(\\)]/g,"");
  if(v.match(/^0[5][0-9]{9}$/)) v="+9"+v;
  else if(v.match(/^[5][0-9]{9}$/)) v="+90"+v;
  else if(v.match(/^90[5][0-9]{9}$/)) v="+"+v;
  else if(v.match(/^0090[5][0-9]{9}$/)) v="+"+v.slice(2);
  $("fTel").value=v;
  validatePhone();
}
function validatePhone(){
  var v=$("fTel").value.replace(/[\\s\\-\\(\\)]/g,"");
  var el=$("fTel");
  var box=$("phoneCheckBox");
  if(!v){el.style.borderColor="";box.innerHTML="";return;}
  if(v.match(/^\\+90[5][0-9]{9}$/)){
    el.style.borderColor="#22c55e";
    box.innerHTML='<div class="addr-check ok"><div class="title">✅ Telefon doğrulandı</div></div>';
    return;
  }
  el.style.borderColor="#ef4444";
  var digits=v.replace(/[^0-9]/g,"");
  var msg="";
  if(digits.length<10){
    msg='<div class="addr-check bad"><div class="title">🔴 Telefon numarası eksik ('+digits.length+' hane var, 10 gerekli)</div></div>';
  }else if(digits.length>12){
    msg='<div class="addr-check warn"><div class="title">⚠️ Telefon numarası çok uzun</div></div>';
  }else if(digits.length>=10&&!digits.match(/^(0?9?0?)?5/)){
    msg='<div class="addr-check bad"><div class="title">🔴 Geçersiz cep telefonu — numara 5 ile başlamalı</div></div>';
  }else{
    msg='<div class="addr-check warn"><div class="title">⚠️ Telefon formatı hatalı — +905xxxxxxxxx olmalı</div></div>';
  }
  box.innerHTML=msg;
}
function cleanAddrIlIlce(){
  var addr=$("fAdres1").value;
  var il=$("fIl").value.trim().toLowerCase();
  var ilce=$("fIlce").value.trim().toLowerCase();
  if(!addr||(!il&&!ilce))return;
  var parts=addr.split(",").map(function(s){return s.trim()});
  var cleaned=parts.filter(function(p){
    var low=p.toLowerCase();
    if(il&&low===il)return false;
    if(ilce&&low===ilce)return false;
    return true;
  });
  $("fAdres1").value=cleaned.join(", ");
}
function fillForm(){
  if(!parsed)return;
  $("fAd").value=parsed.ad||"";$("fSoyad").value=parsed.soyad||"";$("fTel").value=parsed.telefon||"";normalizePhone();
  $("fAdres1").value=(parsed.adres1||"")+(parsed.adres2?(" "+parsed.adres2):"");
  var ilKey=Object.keys(TURKEY_CITIES_FE).find(function(k){return k.toLowerCase()===(parsed.il||"").toLowerCase()});
  $("fIl").value=ilKey||"";$("fIl").setAttribute("data-value",ilKey||"");
  populateIlceSelect(ilKey);
  if(ilKey&&parsed.ilce){var ilceler=TURKEY_CITIES_FE[ilKey];var ilceMatch=ilceler.find(function(d){return d.toLowerCase()===parsed.ilce.toLowerCase()});$("fIlce").value=ilceMatch||"";$("fIlce").setAttribute("data-value",ilceMatch||"");}
  $("fNot").value=parsed.not||"";
  cleanAddrIlIlce();
  $("fDiscount").value="0";$("fDiscountType").value="tl";
  renderAddrCheck();validateCityDistrict();renderProducts();
}
function renderAddrCheck(){
  var box=$("addrCheckBox");
  if(!parsed||!parsed.adres_kontrol){box.innerHTML="";return}
  var ak=parsed.adres_kontrol;
  var cls="ok",icon="✅",label="Adres dogrulandi (Skor: "+ak.skor+"/5)";
  if(ak.skor<=2){cls="bad";icon="🔴";label="Adres sorunu tespit edildi (Skor: "+ak.skor+"/5)"}
  else if(ak.skor<=3){cls="warn";icon="⚠️";label="Adres uyarisi (Skor: "+ak.skor+"/5)"}
  else if(ak.skor===4){label="Adres dogrulandi - kucuk duzeltmeler yapildi (Skor: 4/5)"}
  var html='<div class="addr-check '+cls+'"><div class="title">'+icon+" "+label+"</div>";
  if(ak.duzeltmeler&&ak.duzeltmeler.length>0){
    html+='<div class="fixes">';
    for(var i=0;i<ak.duzeltmeler.length;i++){html+='<div class="fix-item">🔧 '+escHtml(ak.duzeltmeler[i])+'</div>'}
    html+='</div>';
  }
  if(ak.uyarilar&&ak.uyarilar.length>0){
    html+='<div class="fixes">';
    for(var j=0;j<ak.uyarilar.length;j++){html+='<div class="warn-item">⚠️ '+escHtml(ak.uyarilar[j])+'</div>'}
    html+='</div>';
  }
  if(ak.oneri){
    var o=ak.oneri;
    if(o.adres1&&o.adres1!==$("fAdres1").value){
      html+='<div class="fix-item">📍 Adres onerisi: <b>'+escHtml(o.adres1)+'</b> <button class="addr-fix-btn" onclick="applyFix(this)" data-field="fAdres1" data-val="'+escHtml(o.adres1)+'">Duzelt</button></div>';
    }
    if(o.ilce&&o.ilce!==$("fIlce").value){
      html+='<div class="fix-item">📍 Ilce onerisi: <b>'+escHtml(o.ilce)+'</b> <button class="addr-fix-btn" onclick="applyFix(this)" data-field="fIlce" data-val="'+escHtml(o.ilce)+'">Duzelt</button></div>';
    }
    if(o.il&&o.il!==$("fIl").value){
      html+='<div class="fix-item">📍 Il onerisi: <b>'+escHtml(o.il)+'</b> <button class="addr-fix-btn" onclick="applyFix(this)" data-field="fIl" data-val="'+escHtml(o.il)+'">Duzelt</button></div>';
    }
  }
  html+='</div>';box.innerHTML=html;
}
function applyFix(btn){
  var field=btn.getAttribute("data-field");
  var value=btn.getAttribute("data-val");
  if(field==="fIl"){var ilKey=Object.keys(TURKEY_CITIES_FE).find(function(k){return k.toLowerCase()===value.toLowerCase()});$(field).value=ilKey||value;$(field).setAttribute("data-value",ilKey||value);populateIlceSelect(ilKey);}
  else if(field==="fIlce"){$(field).value=value;$(field).setAttribute("data-value",value);}
  else{$(field).value=value;}
  if(parsed&&parsed.adres_kontrol&&parsed.adres_kontrol.oneri){
    var o=parsed.adres_kontrol.oneri;
    if(field==="fAdres1")o.adres1="";
    if(field==="fIlce")o.ilce="";
    if(field==="fIl"){o.il="";if(o.ilce){var items=$("fIlce_list").querySelectorAll(".ss-item");for(var i=0;i<items.length;i++){if(items[i].textContent.toLowerCase()===o.ilce.toLowerCase()){$("fIlce").value=items[i].textContent;$("fIlce").setAttribute("data-value",items[i].textContent);o.ilce="";break;}}}}
  }
  renderAddrCheck();validateCityDistrict();
}
function renderProducts(){
  var el=$("productList");el.innerHTML="";
  if(!parsed||!parsed.urunler)return;
  parsed.urunler.forEach(function(u,i){
    var m=!!u.variant_id;var div=document.createElement("div");
    div.className="product-card "+(m?"matched":"manual");
    div.innerHTML='<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">'+
      '<span class="tag '+(m?"ok":"no")+'">'+(m?"✓ Eslesti":"✗ Manuel")+'</span>'+
      '<span style="font-size:12px;color:#e5e7eb;font-weight:600;flex:1">'+escHtml(u.ad||"")+'</span>'+
      '<button class="btn-del" onclick="removeProduct('+i+')">×</button></div>'+
      '<div style="margin-bottom:6px"><label class="lbl">Katalogdan Sec</label>'+
      '<div class="ss-wrap"><input class="ss-input" id="prod_'+i+'" placeholder="Ürün ara..." data-value="'+(u.variant_id||"")+'" value="'+(m?escHtml(u.ad||""):"")+'" onclick="openSS(this)" oninput="filterSS(this)" autocomplete="off"><div class="ss-list" id="prod_'+i+'_list">'+
      '<div class="ss-item" data-val="" onclick="selectSS($(\\'prod_'+i+'\\'),\\'\\',\\'\\',function(){changeVariant('+i+',\\'\\')})">-- Manuel ürün --</div>'+
      CATALOG.map(function(c){var label=escHtml(c.title+(c.variant?" ("+c.variant+")":""))+" - "+c.price+" TL";return '<div class="ss-item'+(u.variant_id===c.variant_id?" sel":"")+'" data-val="'+c.variant_id+'" onclick="selectSS($(\\'prod_'+i+'\\'),\\''+c.variant_id+'\\',\\''+escHtml(c.title+(c.variant?" ("+c.variant+")":""))+'\\',function(){changeVariant('+i+',\\''+c.variant_id+'\\')})">'+label+'</div>'}).join("")+
      '</div></div></div>'+
      '<div style="display:flex;gap:6px">'+
      '<div><label class="lbl">Adet</label><div style="display:flex;align-items:center;gap:0"><button class="qty-btn" onclick="updateAdet('+i+',(parseInt($(\\'qty_'+i+'\\').value)||1)-1)">−</button><input class="inp qty-inp" id="qty_'+i+'" type="number" value="'+u.adet+'" onchange="updateAdet('+i+',this.value)"><button class="qty-btn" onclick="updateAdet('+i+',(parseInt($(\\'qty_'+i+'\\').value)||1)+1)">+</button></div></div>'+
      '<div style="flex:1;display:flex;align-items:end;padding-bottom:4px"><span style="font-size:13px;color:'+(m?"#34d399":"#fbbf24")+';font-weight:600">'+u.fiyat+' TL</span></div></div>';
    el.appendChild(div);
  });
  updateTotal();
}
function changeVariant(i,vid){
  if(vid){var c=CATALOG.find(function(x){return x.variant_id===Number(vid)});
    if(c){parsed.urunler[i].variant_id=c.variant_id;parsed.urunler[i].ad=c.title+(c.variant?" ("+c.variant+")":"");parsed.urunler[i].fiyat=c.price}}
  else{parsed.urunler[i].variant_id=null}
  renderProducts();
}
function updateAdet(i,v){var n=parseInt(v)||1;if(n<1)n=1;parsed.urunler[i].adet=n;var el=$("qty_"+i);if(el)el.value=n;updateTotal()}
function removeProduct(i){parsed.urunler.splice(i,1);renderProducts()}
function addProduct(){if(parsed){parsed.urunler.push({variant_id:null,ad:"",adet:1,fiyat:"0.00"});renderProducts()}}
function calcDiscount(){
  var sub=parsed.urunler.reduce(function(s,u){return s+(parseFloat(u.fiyat)||0)*u.adet},0);
  var dv=parseFloat($("fDiscount").value)||0;
  var dt=$("fDiscountType").value;
  var disc=dt==="pct"?sub*dv/100:dv;
  if(disc<0)disc=0;if(disc>sub)disc=sub;
  return{sub:sub,disc:disc};
}
function calcShipping(subtotal){
  if(!SHIPPING_RULES||SHIPPING_RULES.length===0)return{name:"Ücretsiz Kargo",price:0};
  var matched=[];
  for(var i=0;i<SHIPPING_RULES.length;i++){
    var r=SHIPPING_RULES[i];
    if(r.min_order!==null&&r.min_order!==undefined&&subtotal<parseFloat(r.min_order))continue;
    if(r.max_order!==null&&r.max_order!==undefined&&subtotal>parseFloat(r.max_order))continue;
    matched.push({name:r.name,price:parseFloat(r.price)||0});
  }
  if(matched.length===0)return{name:"Kargo",price:0};
  matched.sort(function(a,b){return a.price-b.price});
  return matched[0];
}
function updateTotal(){
  if(!parsed)return;var c=calcDiscount();var subtotal=c.sub-c.disc;
  var ship=calcShipping(subtotal);
  var total=subtotal+ship.price;
  $("totalPrice").textContent=total.toFixed(2)+" TL";
  $("discountInfo").textContent=c.disc>0?"-"+c.disc.toFixed(2)+" TL":"";
  var si=$("shippingInfo");
  var freeRule=SHIPPING_RULES.find(function(r){return parseFloat(r.price)===0&&r.min_order});
  if(ship.price===0){
    si.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span style="color:#9ca3af">🚚 Kargo</span><span style="color:#34d399;font-weight:600">'+escHtml(ship.name)+'</span></div>';
  }else{
    var hint=freeRule?'<div style="font-size:11px;color:#6b7280;margin-top:6px;text-align:right">'+parseFloat(freeRule.min_order).toFixed(0)+' TL ve üzeri ücretsiz kargo ('+( parseFloat(freeRule.min_order)-subtotal).toFixed(0)+' TL kaldı)</div>':"";
    si.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><span style="color:#9ca3af">🚚 Kargo</span><span style="color:#fbbf24;font-weight:600">'+escHtml(ship.name)+' — '+ship.price.toFixed(2)+' TL</span></div>'+hint;
  }
}
function applyBundle(){
  if(!parsed)return;
  parsed.urunler=[
    {variant_id:46297518244029,ad:"Kalem ile Yazilabilen Golgeli Kurani Kerim Seti (Beyaz)",adet:1,fiyat:"850.00"},
    {variant_id:46301891723453,ad:"Golgeli Elifba",adet:1,fiyat:"150.00"},
    {variant_id:46301899292861,ad:"Silinebilir Tukenmez Kalem - Siyah",adet:1,fiyat:"100.00"}
  ];
  $("fDiscount").value="50";$("fDiscountType").value="tl";
  renderProducts();
}
function setPayment(p){
  payment=p;
  $("payEft").className="pay-btn"+(p==="eft"?" active-blue":"");
  $("payCod").className="pay-btn"+(p==="cod"?" active-yellow":"");
}
function buildDiscountedLineItems(){
  var c=calcDiscount();var sub=c.sub,disc=c.disc;
  var remaining=Math.round(disc*100);
  var results=[];
  parsed.urunler.forEach(function(u,i){
    var p=parseFloat(u.fiyat)||0;var ld=0;
    if(disc>0){
      if(i<parsed.urunler.length-1){ld=Math.round((p*u.adet/sub)*disc*100);remaining-=ld}
      else{ld=remaining}
    }
    var discLineCents=Math.round(p*u.adet*100)-ld;
    var perUnitCents=Math.floor(discLineCents/u.adet);
    var extraCents=discLineCents-perUnitCents*u.adet;
    function mkLine(vid,title,qty,priceCents){
      var pr=(priceCents/100).toFixed(2);
      var tax=(parseFloat(pr)*qty*0.18/1.18).toFixed(2);
      var tl=[{title:"KDV",rate:0.18,price:tax}];
      if(vid)return{variant_id:vid,quantity:qty,price:pr,tax_lines:tl};
      return{title:title,quantity:qty,price:pr,requires_shipping:true,tax_lines:tl};
    }
    if(extraCents===0||u.adet===1){
      results.push(mkLine(u.variant_id,u.ad,u.adet,u.adet===1?discLineCents:perUnitCents));
    }else{
      results.push(mkLine(u.variant_id,u.ad,extraCents,perUnitCents+1));
      results.push(mkLine(u.variant_id,u.ad,u.adet-extraCents,perUnitCents));
    }
  });
  return results;
}
async function createOrder(){
  if(!parsed||!token)return;
  $("createBtn").disabled=true;hideErr();
  var errors=[];
  var tel=$("fTel").value.trim();
  if(!tel.match(/^\\+90[5][0-9]{9}$/))errors.push("Telefon hatalı — +905xxxxxxxxx formatında olmalı (örn: +905321234567)");
  var il=$("fIl").value;
  var ilce=$("fIlce").value;
  if(!il)errors.push("İl seçilmedi");
  if(!ilce)errors.push("İlçe seçilmedi");
  if(errors.length){showErr(errors.join(" · "));$("createBtn").disabled=false;return;}
  var gateway=payment==="cod"?"Cash on Delivery (COD)":"Money Order";
  var c=calcDiscount();var subtotal=c.sub-c.disc;
  var ship=calcShipping(subtotal);
  var totalAmount=(subtotal+ship.price).toFixed(2);
  var lineItems=buildDiscountedLineItems();
  var body={order:{
    customer:{first_name:$("fAd").value,last_name:$("fSoyad").value},
    line_items:lineItems,
    shipping_address:{first_name:$("fAd").value,last_name:$("fSoyad").value,address1:$("fAdres1").value,address2:$("fIlce").value,city:$("fIl").value,province:$("fIl").value,country:"TR",zip:"",phone:$("fTel").value},
    billing_address:{first_name:$("fAd").value,last_name:$("fSoyad").value,address1:$("fAdres1").value,address2:$("fIlce").value,city:$("fIl").value,province:$("fIl").value,country:"TR",zip:"",phone:$("fTel").value},
    financial_status:payment==="eft"?"paid":"pending",
    gateway:gateway,
    transactions:[{kind:"sale",status:payment==="eft"?"success":"pending",gateway:gateway,amount:totalAmount,currency:"TRY",message:payment==="eft"?"Manual EFT/Havale payment":"Pending the Cash on Delivery (COD) payment from the buyer"}],
    shipping_lines:[{title:ship.name,price:ship.price.toFixed(2),code:ship.name}],
    taxes_included:true,customer_locale:"tr-TR",
    note:$("fNot").value||null,tags:"whatsapp",inventory_behaviour:"decrement_obeying_policy",send_receipt:false,send_fulfillment_receipt:false
  }};
  try{
    var r=await fetch("/api/orders.json",{method:"POST",headers:{"Content-Type":"application/json","Authorization":token},body:JSON.stringify(body)});
    var result=await r.json();
    if(result.order){
      var d=result.order;hide("step1");hide("step2");show("successCard");
      var confBox=$("confettiBox");confBox.innerHTML="";
      var confColors=["#FFD700","#FF6B6B","#4ECDC4","#A78BFA","#F472B6","#34D399","#FBBF24","#60A5FA"];
      for(var ci=0;ci<20;ci++){var sp=document.createElement("span");sp.style.left=Math.random()*100+"%";sp.style.background=confColors[ci%confColors.length];sp.style.animationDelay=(Math.random()*0.8)+"s";sp.style.animationDuration=(1+Math.random()*1)+"s";confBox.appendChild(sp)}
      var fullName=$("fAd").value+" "+$("fSoyad").value;
      var addr=$("fAdres1").value;
      var city=$("fIlce").value+"/"+$("fIl").value;
      $("sucOrderName").textContent=d.name;
      $("sucDate").textContent=new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});
      $("sucCustomer").textContent=fullName;$("sucPhone").textContent=$("fTel").value;
      $("sucAddress").textContent=addr;$("sucCity").textContent=city;
      $("sucTotal").textContent="₺"+d.total_price;
      var sucShipEl=$("sucShipping");
      if(ship.price===0){sucShipEl.textContent=ship.name;sucShipEl.style.color="#128C7E"}
      else{sucShipEl.textContent=ship.name+" — ₺"+ship.price.toFixed(2);sucShipEl.style.color="#f59e0b"}
      $("sucLink").href="https://admin.shopify.com/store/"+STORE_SLUG+"/orders/"+d.id;
      var payEl=$("sucPayment");
      if(payment==="cod"){payEl.textContent="🚚 Kapida Odeme";payEl.className="os-payment cod"}
      else{payEl.textContent="🏦 Havale/EFT";payEl.className="os-payment eft"}
      var note=$("fNot").value;
      if(note){$("sucNote").textContent=note;$("sucNoteSection").style.display="block"}
      else{$("sucNoteSection").style.display="none"}
      var prodHTML="";var discItems=buildDiscountedLineItems();
      for(var idx=0;idx<discItems.length;idx++){
        var di=discItems[idx];var dp=di.price;var dq=di.quantity;
        var dName=di.title||(parsed.urunler.find(function(u){return u.variant_id&&u.variant_id===di.variant_id})||{}).ad||"Ürün";
        var lt=(parseFloat(dp)*dq).toFixed(2);
        prodHTML+='<div class="os-product"><div><div class="name">'+escHtml(dName)+'</div><div class="qty">'+dq+' adet × ₺'+dp+'</div></div><div class="price">₺'+lt+'</div></div>';
      }
      $("sucProducts").innerHTML=prodHTML;
      var payLabel=payment==="cod"?"kapıda ödeme":"havale";
      var replyMsg=d.name+" numaralı "+payLabel+" siparişiniz oluşturulmuştur efendim. Siparişiniz Sürat Kargo ile gönderilecek olup teslimat süresi ortalama 2 iş günüdür. Siparişiniz için teşekkür eder, iyi günler dileriz.";
      $("sucReply").textContent=replyMsg;
      orderHistory.unshift({customer:fullName,phone:$("fTel").value,city:city,items:parsed.urunler.map(function(u){return u.ad+" x"+u.adet}).join(", "),payment:payment==="cod"?"Kapida":"Havale",name:d.name,id:d.id,time:new Date().toLocaleString("tr-TR")});
      $("histCount").textContent=orderHistory.length;renderHistory();
    }else if(result.errors){showErr("Shopify hata: "+JSON.stringify(result.errors))}
    else{showErr("Beklenmeyen yanit: "+JSON.stringify(result).substring(0,300))}
  }catch(e){showErr(e.message)}
  $("createBtn").disabled=false;
}
function resetOrder(){parsed=null;$("msgInput").value="";hide("successCard");show("step1");hide("step2");hideErr();$("addrCheckBox").innerHTML=""}
async function copyScreenshot(){
  try{
    $("copyScreenBtn").textContent="⏳ Oluşturuluyor...";
    var replyEl=$("sucReply");replyEl.removeAttribute("contenteditable");
    var h2cOpts={scale:2,backgroundColor:"#ffffff",useCORS:true,allowTaint:false,logging:false};
    var isMobile="ontouchstart" in window||navigator.maxTouchPoints>0;
    if(isMobile&&navigator.share){
      var canvas=await html2canvas($("orderSummary"),h2cOpts);
      replyEl.setAttribute("contenteditable","true");
      var blob=await new Promise(function(r){canvas.toBlob(r,"image/png")});
      var file=new File([blob],"siparis.png",{type:"image/png"});
      if(navigator.canShare&&navigator.canShare({files:[file]})){
        await navigator.share({files:[file]});
        $("copyScreenBtn").textContent="✅ Paylaşıldı!";
        setTimeout(function(){$("copyScreenBtn").textContent="📸 Görüntü Paylaş"},2000);
        return;
      }
    }
    var blobPromise=html2canvas($("orderSummary"),h2cOpts).then(function(c){replyEl.setAttribute("contenteditable","true");return new Promise(function(r){c.toBlob(r,"image/png")})});
    await navigator.clipboard.write([new ClipboardItem({"image/png":blobPromise})]);
    $("copyScreenBtn").textContent="✅ Kopyalandı!";
    setTimeout(function(){$("copyScreenBtn").textContent="📸 Görüntü Paylaş"},2000);
  }catch(e){
    $("sucReply").setAttribute("contenteditable","true");
    $("copyScreenBtn").textContent="📸 Görüntü Paylaş";
    showErr("Görüntü kopyalanamadı: "+e.message);
  }
}
function copyReply(){
  var msg=$("sucReply").textContent;
  navigator.clipboard.writeText(msg).then(function(){
    $("copyReplyBtn").textContent="✅ Kopyalandı!";
    setTimeout(function(){$("copyReplyBtn").textContent="📋 Mesajı Kopyala"},2000);
  });
}
function renderHistory(){
  var el=$("historyList");
  if(orderHistory.length===0){el.innerHTML='<div style="text-align:center;color:#4b5563;padding:20px">Henuz siparis yok</div>';return}
  el.innerHTML=orderHistory.map(function(h){
    return '<div class="history-item"><div class="top"><div><b>'+escHtml(h.customer)+'</b><a class="link" href="https://admin.shopify.com/store/'+STORE_SLUG+'/orders/'+h.id+'" target="_blank">'+escHtml(h.name)+' ↗</a></div><span class="time">'+h.time+'</span></div>'+
    '<div class="detail">📞 '+escHtml(h.phone)+' · 📍 '+escHtml(h.city)+' · '+escHtml(h.items)+'<span class="pay-tag '+(h.payment==="Kapida"?"cod":"eft")+'">'+h.payment+'</span></div></div>'
  }).join("");
}
<\/script>
</body>
</html>`;
}
function getLoginHTML() {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Giris | Eavrasya</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2325D366'/%3E%3Cstop offset='100%25' stop-color='%23128C7E'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cpath d='M16 6c-5.5 0-10 3.9-10 8.7 0 2.7 1.5 5.2 3.9 6.8L9 25l3.8-2c1 .3 2.1.4 3.2.4 5.5 0 10-3.9 10-8.7S21.5 6 16 6z' fill='rgba(255,255,255,0.25)'/%3E%3Cpath d='M14 12h4l1 4h-2v3h-2v-3h-2l1-4z' fill='white'/%3E%3C/svg%3E">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#0c0e14;color:#d1d5db;min-height:100vh;display:flex;align-items:center;justify-content:center}
.login-card{background:#111318;border:1px solid #1a1d27;border-radius:14px;padding:32px;width:100%;max-width:360px;text-align:center}
.login-logo{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#25D366,#128C7E);display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px}
.login-title{font-size:18px;font-weight:700;color:#f0f0f0;margin-bottom:4px}
.login-sub{font-size:12px;color:#555;margin-bottom:24px}
.login-inp{width:100%;padding:12px 14px;background:#0c0e14;border:1px solid #1a1d27;border-radius:8px;color:#f0f0f0;font-size:14px;outline:none;margin-bottom:12px;text-align:center;letter-spacing:1px}
.login-inp:focus{border-color:#25D366}
.login-btn{width:100%;padding:14px;background:linear-gradient(135deg,#25D366,#128C7E);border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:700;cursor:pointer}
.login-btn:disabled{opacity:.4;cursor:not-allowed}
.login-err{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.1);border-radius:7px;padding:9px 12px;margin-bottom:12px;font-size:12px;color:#fca5a5;display:none}
</style>
</head>
<body>
<div class="login-card">
  <div class="login-logo">💬</div>
  <div class="login-title">WhatsApp Siparis</div>
  <div class="login-sub">Eavrasya · Yonetim Paneli</div>
  <div class="login-err" id="loginErr"></div>
  <input class="login-inp" id="loginPass" type="password" placeholder="Sifre" onkeydown="if(event.key==='Enter')doLogin()">
  <button class="login-btn" id="loginBtn" onclick="doLogin()">Giris Yap</button>
</div>
<script>
async function doLogin(){
  var pass=document.getElementById("loginPass").value;
  if(!pass)return;
  document.getElementById("loginBtn").disabled=true;
  try{
    var r=await fetch("/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pass})});
    var d=await r.json();
    if(d.ok){location.reload()}
    else{document.getElementById("loginErr").textContent="Yanlis sifre";document.getElementById("loginErr").style.display="block"}
  }catch(e){document.getElementById("loginErr").textContent="Hata: "+e.message;document.getElementById("loginErr").style.display="block"}
  document.getElementById("loginBtn").disabled=false;
}
<\/script>
</body>
</html>`;
}
