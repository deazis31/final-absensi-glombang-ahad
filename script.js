function toggleMenu() {
    const nav = document.querySelector('.navbar-nav');
    nav.classList.toggle('active');
}

function toggleAttendance(checkbox, otherClass, type, index, kelompok) {
    const row = checkbox.parentElement.parentElement;
    const otherCheckbox = row.querySelector(`input.${otherClass}`);
    const nama = row.cells[1].textContent;
    const reasonInput = row.querySelector(`.reason-input.${type}-${index}`);

    // Pastikan hanya satu checkbox yang dicentang
    if (checkbox.checked && otherCheckbox) {
        otherCheckbox.checked = false;
    }

    // Kontrol tampilan kolom alasan
    if (reasonInput) {
        if (nama === 'Bilqis Silva H' || nama === 'Soviyah oktiningsih') {
            reasonInput.style.display = 'none';
        } else {
            reasonInput.style.display = row.querySelector(`.tidak-${type}`).checked ? 'block' : 'none';
        }
    }
}

function saveAttendance() {
    const kelompok = ['karanggayam', 'sidodadi', 'kwagean'];
    let attendanceData = {};
    let tidakHadirPutra = [];
    let tidakHadirPutri = [];
    const timestamp = new Date().toISOString();

    kelompok.forEach(group => {
        attendanceData[group] = { putra: [], putri: [] };

        const tablePutra = document.getElementById(`${group}-putra`);
        const rowsPutra = tablePutra.querySelectorAll('tbody tr');
        rowsPutra.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putra')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putra')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putra-${no}`)?.value.trim() || '';

            if (nama) {
                let status = hadir ? 'Hadir' : 'Tidak Hadir Tanpa Keterangan';
                if (tidakHadir) {
                    status = alasan ? `Tidak Hadir (${alasan})` : 'Tidak Hadir Tanpa Keterangan';
                }
                attendanceData[group].putra.push({ no, nama, status, alasan, kelompok: group });
                if (!hadir) {
                    tidakHadirPutra.push({ text: `${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`, kelompok: group });
                }
            }
        });

        const tablePutri = document.getElementById(`${group}-putri`);
        const rowsPutri = tablePutri.querySelectorAll('tbody tr');
        rowsPutri.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putri')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putri')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putri-${no}`)?.value.trim() || '';

            if (nama) {
                let status = hadir ? 'Hadir' : 'Tidak Hadir Tanpa Keterangan';
                if (tidakHadir) {
                    status = alasan && nama !== 'Bilqis Silva H' && nama !== 'Soviyah oktiningsih' ? `Tidak Hadir (${alasan})` : 'Tidak Hadir Tanpa Keterangan';
                }
                attendanceData[group].putri.push({ no, nama, status, alasan, kelompok: group });
                if (!hadir) {
                    tidakHadirPutri.push({ text: `${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`, kelompok: group });
                }
            }
        });
    });

    const tidakHadirPutraUl = document.getElementById('tidakHadirPutra');
    tidakHadirPutraUl.innerHTML = '';
    if (tidakHadirPutra.length === 0) {
        tidakHadirPutraUl.innerHTML = '<li>Tidak ada yang tidak hadir.</li>';
    } else {
        tidakHadirPutra.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.text;
            if (item.kelompok === 'kwagean') {
                li.classList.add('kwagean');
            }
            tidakHadirPutraUl.appendChild(li);
        });
    }

    const tidakHadirPutriUl = document.getElementById('tidakHadirPutri');
    tidakHadirPutriUl.innerHTML = '';
    if (tidakHadirPutri.length === 0) {
        tidakHadirPutriUl.innerHTML = '<li>Tidak ada yang tidak hadir.</li>';
    } else {
        tidakHadirPutri.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.text;
            if (item.kelompok === 'kwagean') {
                li.classList.add('kwagean');
            }
            tidakHadirPutriUl.appendChild(li);
        });
    }

    let savedData = JSON.parse(localStorage.getItem('attendanceHistory')) || [];
    savedData.push({ timestamp, data: attendanceData });
    localStorage.setItem('attendanceHistory', JSON.stringify(savedData));

    alert('Absensi telah disimpan!');
}

function sendToWhatsApp() {
    const kelompok = ['karanggayam', 'sidodadi', 'kwagean'];
    let tidakHadirPutra = [];
    let tidakHadirPutri = [];

    kelompok.forEach(group => {
        const tablePutra = document.getElementById(`${group}-putra`);
        const rowsPutra = tablePutra.querySelectorAll('tbody tr');
        rowsPutra.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putra')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putra')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putra-${no}`)?.value.trim() || '';

            if (nama && !hadir) {
                tidakHadirPutra.push(`${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`);
            }
        });

        const tablePutri = document.getElementById(`${group}-putri`);
        const rowsPutri = tablePutri.querySelectorAll('tbody tr');
        rowsPutri.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putri')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putri')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putri-${no}`)?.value.trim() || '';

            if (nama && !hadir) {
                tidakHadirPutri.push(`${nama} (${group}): ${alasan || 'Tanpa Keterangan'}`);
            }
        });
    });

    let message = '*Daftar Tidak Hadir*\n\n*Putra:*\n';
    if (tidakHadirPutra.length === 0) {
        message += 'Tidak ada yang tidak hadir.\n';
    } else {
        tidakHadirPutra.forEach((item, index) => {
            message += `${index + 1}. ${item}\n`;
        });
    }

    message += '\n*Putri:*\n';
    if (tidakHadirPutri.length === 0) {
        message += 'Tidak ada yang tidak hadir.\n';
    } else {
        tidakHadirPutri.forEach((item, index) => {
            message += `${index + 1}. ${item}\n`;
        });
    }

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '+6283801847614';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function downloadAttendance() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const kelompok = ['karanggayam', 'sidodadi', 'kwagean'];
    let y = 10;

    const date = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);

    doc.setFontSize(16);
    doc.text('Laporan Absensi Kelompok', 10, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(`Tanggal: ${formattedDate}`, 10, y);
    y += 10;

    kelompok.forEach(group => {
        doc.setFontSize(12);
        doc.text(`Kelompok ${group.charAt(0).toUpperCase() + group.slice(1)}`, 10, y);
        y += 10;

        doc.setFontSize(10);
        doc.text('Putra:', 10, y);
        y += 5;

        const tablePutra = document.getElementById(`${group}-putra`);
        const rowsPutra = tablePutra.querySelectorAll('tbody tr');
        const dataPutra = [];
        rowsPutra.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putra')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putra')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putra-${no}`)?.value.trim() || '';
            dataPutra.push([
                no,
                nama,
                hadir ? 'Hadir' : '',
                !hadir ? 'Tidak Hadir' : '',
                !hadir ? (alasan || 'Tanpa Keterangan') : ''
            ]);
        });

        doc.autoTable({
            startY: y,
            head: [['No', 'Nama', 'Hadir', 'Tidak Hadir', 'Alasan Tidak Hadir']],
            body: dataPutra,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 80 },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 50 }
            }
        });
        y = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        doc.text('Putri:', 10, y);
        y += 5;

        const tablePutri = document.getElementById(`${group}-putri`);
        const rowsPutri = tablePutri.querySelectorAll('tbody tr');
        const dataPutri = [];
        rowsPutri.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putri')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putri')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putri-${no}`)?.value.trim() || '';
            dataPutri.push([
                no,
                nama,
                hadir ? 'Hadir' : '',
                !hadir ? 'Tidak Hadir' : '',
                !hadir && nama !== 'Bilqis Silva H' && nama !== 'Soviyah oktiningsih' ? (alasan || 'Tanpa Keterangan') : ''
            ]);
        });

        doc.autoTable({
            startY: y,
            head: [['No', 'Nama', 'Hadir', 'Tidak Hadir', 'Alasan Tidak Hadir']],
            body: dataPutri,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 80 },
                2: { cellWidth: 20 },
                3: { cellWidth: 20 },
                4: { cellWidth: 50 }
            }
        });
        y = doc.lastAutoTable.finalY + 10;

        if (y > 250) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save(`Absensi_${new Date().toISOString().split('T')[0]}.pdf`);
}

function downloadExcel() {
    const kelompok = ['karanggayam', 'sidodadi', 'kwagean'];
    const date = new Date();
    const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const wb = XLSX.utils.book_new();

    kelompok.forEach(group => {
        const tablePutra = document.getElementById(`${group}-putra`);
        const rowsPutra = tablePutra.querySelectorAll('tbody tr');
        const dataPutra = [
            [`Kelompok ${group.charAt(0).toUpperCase() + group.slice(1)} - Putra`],
            [`Tanggal: ${formattedDate}`],
            [],
            ['No', 'Nama', 'Hadir', 'Tidak Hadir', 'Alasan Tidak Hadir']
        ];
        rowsPutra.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putra')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putra')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putra-${no}`)?.value.trim() || '';
            dataPutra.push([
                no,
                nama,
                hadir ? 'Hadir' : '',
                !hadir ? 'Tidak Hadir' : '',
                !hadir ? (alasan || 'Tanpa Keterangan') : ''
            ]);
        });

        const tablePutri = document.getElementById(`${group}-putri`);
        const rowsPutri = tablePutri.querySelectorAll('tbody tr');
        const dataPutri = [
            [],
            [`Kelompok ${group.charAt(0).toUpperCase() + group.slice(1)} - Putri`],
            [`Tanggal: ${formattedDate}`],
            [],
            ['No', 'Nama', 'Hadir', 'Tidak Hadir', 'Alasan Tidak Hadir']
        ];
        rowsPutri.forEach(row => {
            const no = row.cells[0].textContent;
            const nama = row.cells[1].textContent;
            const hadir = row.querySelector('.hadir-putri')?.checked || false;
            const tidakHadir = row.querySelector('.tidak-putri')?.checked || false;
            const alasan = row.querySelector(`.reason-input.putri-${no}`)?.value.trim() || '';
            dataPutri.push([
                no,
                nama,
                hadir ? 'Hadir' : '',
                !hadir ? 'Tidak Hadir' : '',
                !hadir && nama !== 'Bilqis Silva H' && nama !== 'Soviyah oktiningsih' ? (alasan || 'Tanpa Keterangan') : ''
            ]);
        });

        const wsData = [...dataPutra, [], ...dataPutri];
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        ws['!cols'] = [
            { wch: 5 },
            { wch: 30 },
            { wch: 10 },
            { wch: 15 },
            { wch: 30 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, `${group.charAt(0).toUpperCase() + group.slice(1)}`);
    });

    XLSX.writeFile(wb, `Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
}