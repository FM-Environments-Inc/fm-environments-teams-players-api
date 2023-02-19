/**
 * Make any changes you need to make to the database here
 */
async function up() {
  await this('region').create([
    { name: 'AA' },
    { name: 'WEU' },
    { name: 'EEU' },
    { name: 'SEA' },
    { name: 'CH' },
  ]);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  const names = ['AA', 'WEU', 'EEU', 'SEA', 'CH'];
  await this('region').deleteMany({ name: { $in: names } });
}

module.exports = { up, down };
