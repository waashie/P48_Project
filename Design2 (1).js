function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.style.width = '200px';
    overlay.style.display = 'block';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.style.width = '0';
    overlay.style.display = 'none';
}

const social = document.querySelector('.social');
const icon   = document.querySelector('.btn-icon');

social.addEventListener('mouseenter', () => icon.textContent = '↺');
social.addEventListener('mouseleave', () => icon.textContent = '∨');

document.addEventListener('DOMContentLoaded', function () {

    const confirmBtn = document.getElementById('confirmButton');
    const modal      = document.getElementById('confirmModal');
    const splitLeft  = document.getElementById('splitLeft');

    if (!confirmBtn || !modal) return;

    confirmBtn.addEventListener('click', function () {

        if (typeof getAllTotals === 'function') getAllTotals();

        const station  = document.getElementById('mainStationName')?.innerText  || 'Not selected';
        const category = document.getElementById('mainCategoryName')?.innerText || 'Not selected';
        const ads      = document.getElementById('mainTotalAds')?.innerText     || '0';
        const endCost  = document.getElementById('campaignCost')?.innerText     || '$0.00';
        const start    = document.getElementById('startWeekBtn')?.innerText     || 'Start Week';
        const end      = document.getElementById('endWeekBtn')?.innerText       || 'End Week';

        document.getElementById('confirmStation').innerText  = station;
        document.getElementById('confirmCategory').innerText = category;
        document.getElementById('confirmAds').innerText      = ads;
        document.getElementById('confirmCost').innerText     = endCost;
        document.getElementById('confirmWeek').innerText     = `${start} > ${end}`;

        modal.style.display = 'flex';

        // Mark left panel as confirmed
        if (splitLeft) {
            splitLeft.classList.add('confirmed-state');
            var labels = splitLeft.querySelectorAll('.split-label');
            if (labels.length >= 2) {
                labels[0].textContent = '✔';
                labels[1].textContent = 'Confirmed';
            }
            confirmBtn.style.pointerEvents = 'none';
        }
    });

    window.closeConfirmModal = function () {
        modal.style.display = 'none';
    };

    modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.style.display = 'none';
    });

});
