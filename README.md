# Modern Not Defteri Uygulaması

Bu proje, JSON Server kullanarak geliştirilmiş modern bir not defteri uygulamasıdır. Kullanıcılar notlar oluşturabilir, düzenleyebilir, silebilir.

## Özellikler

- Not ekleme, düzenleme ve silme
- Notlarda arama yapma
- Notlar için renk seçimi
- JSON Server ile veri yönetimi

## Kurulum

Aşağıdaki adımları izleyerek uygulamayı yerel makinenizde çalıştırabilirsiniz.

### Gereksinimler

- [Node.js](https://nodejs.org/) (v12 veya üzeri)
- npm (Node.js ile birlikte gelir)

### JSON Server Kurulumu

#### Windows

1. Komut istemini (Command Prompt) veya PowerShell'i yönetici olarak açın.
2. JSON Server'ı global olarak yüklemek için aşağıdaki komutu çalıştırın:

```bash
npm install -g json-server
```

#### macOS

1. Terminal uygulamasını açın.
2. JSON Server'ı global olarak yüklemek için aşağıdaki komutu çalıştırın:

```bash
sudo npm install -g json-server
```

3. İşlem sırasında şifrenizi girmeniz istenebilir.

### Uygulamayı Çalıştırma

1. Proje klasörüne gidin:

```bash
# Windows için
cd "yol\nesnelerin_internti_proje_notdefteri"

# macOS için
cd "yol/nesnelerin_internti_proje_notdefteri"
```

2. JSON Server'ı başlatın:

```bash
json-server --watch db.json
```

3. Tarayıcınızda `http://localhost:3000` adresine giderek JSON API'ye erişebilirsiniz.
4. Uygulamayı kullanmak için `index.html` dosyasını bir tarayıcıda açın veya bir yerel sunucu kullanın.

#### Yerel Sunucu Kullanma (Opsiyonel)

Basit bir HTTP sunucusu kullanarak uygulamayı çalıştırmak için:

##### Windows (Python kullanarak)

```bash
python -m http.server
```

##### macOS (Python kullanarak)

```bash
python -m SimpleHTTPServer 8000
```

Daha sonra tarayıcınızda `http://localhost:8000` adresine giderek uygulamayı kullanabilirsiniz.

## API Endpointleri

JSON Server aşağıdaki endpointleri sağlar:

- `GET /notes`: Tüm notları listeler
- `GET /notes/:id`: Belirli bir notu getirir
- `POST /notes`: Yeni bir not ekler
- `PATCH /notes/:id`: Bir notu günceller
- `DELETE /notes/:id`: Bir notu siler
- `GET /categories`: Tüm kategorileri listeler
- `POST /categories`: Yeni bir kategori ekler

## Sorun Giderme

### JSON Server Çalışmıyor

Eğer JSON Server başlatılırken hata alıyorsanız:

1. Node.js'in doğru şekilde kurulu olduğundan emin olun: `node -v`
2. JSON Server'ın doğru şekilde kurulu olduğundan emin olun: `json-server -v`
3. Başka bir uygulamanın 3000 portunu kullanmadığından emin olun. Farklı bir port kullanmak için: `json-server --watch db.json --port 3001`

### Node.js Sürüm Uyumluluk Sorunları

Node.js'in yeni sürümlerinde (özellikle v17 ve üzeri) JSON Server kurulumunda veya çalıştırılmasında sorunlar yaşanabilir. Bu durumda aşağıdaki çözümleri deneyebilirsiniz:

1. Node.js'in LTS (Uzun Süreli Destek) sürümünü kullanın (v16.x gibi).
   ```bash
   npx json-server --watch db.json
   ```

### CORS Hatası

Eğer tarayıcıda CORS hatası alıyorsanız, JSON Server'ı başlatırken `--no-cors` parametresini ekleyin:

```bash
json-server --watch db.json --no-cors
```

### Kategori Ekleme Sorunu

Eğer kategori ekleme işlemi çalışmıyorsa, aşağıdaki adımları kontrol edin:

1. JSON Server'ın çalıştığından emin olun (http://localhost:3000/categories adresine erişilebilmeli).
2. Kategori eklerken hata alıyorsanız, bu muhtemelen API isteğinin formatından kaynaklanmaktadır. Kategori eklemek için doğru format:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"id": "kategori_adi"}' http://localhost:3000/categories
   ```
3. Tarayıcı konsolunda (F12) hata mesajlarını kontrol edin.
4. db.json dosyasında "categories" dizisi olduğundan emin olun. Eğer yoksa, dosyayı şu şekilde düzenleyin:
   ```json
   {
     "notes": [],
     "categories": ["work", "personal", "ideas"]
   }
   ```