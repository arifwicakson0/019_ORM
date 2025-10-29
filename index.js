const express = require('express');
const app = express();
const db = require('./models');
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.listen(PORT, () => {
  console.log('server started on port 3000');
})

db.sequelize.sync()
.then(() => {
  app.listen(3000, () => {
    console.log('Server started');
  });
})

.catch((err) => {
  console.log(err);
});

// --- RUTE API ---

// 1. Rute untuk membuat Komik baru
app.post('/Komiks', async (req, res) => {
  const data = req.body;
  try {
    const Komik = await db.Komik.create(data);
    res.status(201).send(Komik); // 201 = Created
  } catch (err) {
    res.status(500).send({ message: 'Gagal membuat Komik', error: err.message });
  }
});

// 2. Rute untuk mengambil SEMUA Komik
app.get('/Komiks', async (req, res) => {
  try {
    const Komiks = await db.Komik.findAll();
    res.send(Komiks);
  } catch (err) {
    res.status(500).send({ message: 'Gagal mengambil data', error: err.message });
  }
});

// 3. Rute untuk mengambil SATU Komik berdasarkan ID (YANG HILANG)
app.get('/Komiks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const Komik = await db.Komik.findByPk(id);

    if (!Komik) {
      return res.status(404).send({ message: 'Komik tidak di temukan' });
    }
    res.send(Komik);
  } catch (err) {
    res.status(500).send({ message: 'Gagal mengambil data', error: err.message });
  }
});


// 4. Rute untuk meng-update Komik berdasarkan ID
app.put('/Komiks/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body; 

  try {
    const Komik = await db.Komik.findByPk(id);

    if (!Komik) {
      return res.status(404).send({ message: 'Komik tidak di temukan' });
    }
    
    await Komik.update(data);
    res.send(Komik); // Kirim data yang sudah di-update

  } catch (err) {
    res.status(500).send({ message: 'Gagal meng-update Komik', error: err.message });
  }
});

// 5. Rute untuk menghapus Komik berdasarkan ID
app.delete('/Komiks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const Komik = await db.Komik.findByPk(id);
    
    if (!Komik) {
      return res.status(404).send({ message: 'Komik tidak di temukan' });
    }

    await Komik.destroy();
    res.send({ message: 'Komik berhasil di hapus' });
  } catch (err) {
    res.status(500).send({ message: 'Gagal menghapus Komik', error: err.message });
  }
});