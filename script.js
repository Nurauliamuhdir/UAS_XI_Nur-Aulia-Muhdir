const products = [
    {
        id: 1,
        nama: "Sarung Tenun Goyor",
        kategori: "pakaian",
        harga: 150000,
        stok: 12,
        deskripsi: "Sarung tenun tradisional berbahan adem dan nyaman dipakai beribadah."
    },
    {
        id: 2,
        nama: "Kopiah Hitam Klasik",
        kategori: "pakaian",
        harga: 45000,
        stok: 25,
        deskripsi: "Peci beludru hitam jahitan rapi, cocok untuk kegiatan harian maupun resmi."
    },
    {
        id: 3,
        nama: "Keripik Tempe Renyah",
        kategori: "makanan",
        harga: 15000,
        stok: 50,
        deskripsi: "Camilan renyah gurih olahan dapur santri tanpa bahan pengawet."
    },
    {
        id: 4,
        nama: "Madu Murni Pesantren",
        kategori: "makanan",
        harga: 85000,
        stok: 8,
        deskripsi: "Madu hutan murni kemasan 250 ml untuk menjaga stamina harian."
    },
    {
        id: 5,
        nama: "Kaligrafi Ukir Kayu",
        kategori: "kerajinan",
        harga: 250000,
        stok: 5,
        deskripsi: "Hiasan dinding ukiran kayu jati karya santri seni rupa."
    },
    {
        id: 6,
        nama: "Tas Tasbih Rajut",
        kategori: "kerajinan",
        harga: 35000,
        stok: 15,
        deskripsi: "Dompet rajut tangan serbaguna untuk menyimpan tasbih dan perlengkapan kecil."
    }
];

// Memilih Elemen DOM
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const totalInventoryEl = document.getElementById("totalInventory");
const addProductForm = document.getElementById("addProductForm");

// TANTANGAN 4: Fungsi Menghitung & Menampilkan Total Nilai Inventaris
function updateTotalInventory() {
    const totalNilai = products.reduce((total, product) => {
        return total + (product.harga * product.stok);
    }, 0);
    totalInventoryEl.innerText = `Rp ${totalNilai.toLocaleString('id-ID')}`;
}

// PRAKTIK 4: Fungsi untuk Merender Produk ke Halaman
function renderProducts(productList) {
    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>Produk tidak ditemukan.</p>";
        return;
    }

    productList.forEach(product => {
        const isOutOfStock = product.stok === 0;
        const card = document.createElement("div");
        // TANTANGAN 2: Tambahkan class 'out-of-stock' jika stok === 0
        card.className = isOutOfStock ? "card out-of-stock" : "card";
        card.id = `card-${product.id}`;

        card.innerHTML = `
            <div>
                <span class="badge">${product.kategori.toUpperCase()}</span>
                <h3>${product.nama}</h3>
                <p class="description">${product.deskripsi}</p>
                <p class="price">Rp ${product.harga.toLocaleString('id-ID')}</p>
                <p>Stok Tersedia: <strong id="stock-${product.id}">${product.stok}</strong></p>
                <p id="status-${product.id}" class="out-of-stock-text">${isOutOfStock ? "Stok Habis" : ""}</p>
            </div>
            <div class="stock-control">
                <button class="btn-stock" onclick="updateStock(${product.id}, -1)">-</button>
                <span>Beli / Kurang</span>
                <button class="btn-stock" onclick="updateStock(${product.id}, 1)">+</button>
            </div>
        `;
        productContainer.appendChild(card);
    });
}

// PRAKTIK 4: Fungsi Filter dan Pencarian (diperbaiki dengan return)
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = products.filter(product => {
        const matchName = product.nama.toLowerCase().includes(searchTerm);
        const matchCategory = selectedCategory === "all" || product.kategori === selectedCategory;
        return matchName && matchCategory;
    });

    renderProducts(filtered);
}

// Event Listener Pencarian & Filter
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// PRAKTIK 5: Fungsi Memperbarui Stok Produk Secara Real-Time
function updateStock(productId, change) {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (product.stok + change < 0) {
            alert("Stok tidak boleh kurang dari 0!");
            return;
        }

        product.stok += change;

        // Update elemen spesifik di DOM
        const stockElement = document.getElementById(`stock-${product.id}`);
        const cardElement = document.getElementById(`card-${product.id}`);
        const statusElement = document.getElementById(`status-${product.id}`);

        if (stockElement) {
            stockElement.innerText = product.stok;
        }

        // TANTANGAN 2: Update tampilan stok habis secara real-time
        if (cardElement && statusElement) {
            if (product.stok === 0) {
                cardElement.classList.add("out-of-stock");
                statusElement.innerText = "Stok Habis";
            } else {
                cardElement.classList.remove("out-of-stock");
                statusElement.innerText = "";
            }
        }

        // TANTANGAN 4: Perbarui total nilai inventaris
        updateTotalInventory();
    }
}

// TANTANGAN 3: Event Listener Form Tambah Produk
addProductForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("newNama").value.trim();
    const kategori = document.getElementById("newKategori").value;
    const harga = Number(document.getElementById("newHarga").value);
    const stok = Number(document.getElementById("newStok").value);
    const deskripsi = document.getElementById("newDeskripsi").value.trim();

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    products.push({
        id: newId,
        nama: nama,
        kategori: kategori,
        harga: harga,
        stok: stok,
        deskripsi: deskripsi
    });

    addProductForm.reset();
    filterProducts();
    updateTotalInventory();
});

// Inisialisasi Tampilan Pertama Kali
renderProducts(products);
updateTotalInventory();