const BIN_URL = "https://api.jsonbin.io/v3/b/69d64d85aaba882197d7b2d3";
const API_KEY = "$2a$10$/7rPjhs9VC0KmAsekZPVYeQhIkDfHoLsbB8bCWbDptzre/cXev1JK";

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('galleryGrid');
    
    try {
        const response = await fetch(BIN_URL, {
            headers: {
                "X-Master-Key": API_KEY
            }
        });
        const data = await response.json();
        
        // JSONBin wraps data in the 'record' object
        const collections = data.record || [];

        if (collections.length === 0) {
            grid.innerHTML = '';
            return;
        }

        collections.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

        collections.forEach((item, index) => {
            const dateOpt = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = new Date(item.dateAdded).toLocaleDateString('en-US', dateOpt);
            
            const isLatest = index === 0;
            const badgeHTML = isLatest ? '<span class="badge">LATEST</span>' : '';

            const card = document.createElement('div');
            card.className = `card ${isLatest ? 'card-featured' : ''}`;
            card.style.padding = '1.5rem';
            card.innerHTML = `
                ${badgeHTML}
                <div class="card-content" style="padding: 0;">
                <h2 class="card-title">${escapeHTML(item.name)}</h2>
                <div class="card-date">
                    <i class="far fa-clock"></i> ${formattedDate}
                </div>
                <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="card-btn">
                    <i class="fas fa-file-download"></i> ดาวน์โหลด / เปิดดูเอกสาร
                </a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        grid.innerHTML = '<p style="color:var(--text-secondary); text-align:center;">ไม่สามารถโหลดข้อมูลได้ หรือตู้คลังสินค้า (Bin) เพิ่งถูกสร้างใหม่ โปรดเพิ่มรูปลงคลังก่อนครับ</p>';
    }
});

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[tag] || tag));
}
