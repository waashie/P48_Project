var LENGTHS = [':15', ':30', ':45', ':60'];
var DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

var rows = [
    { name: 'Mornings (7a-10a)',     len: ':60', Mo: 0, Tu: 0, We: 0, Th: 0, Fr: 0, Sa: 0, Su: 0 },
    { name: 'Middays (10a-3p)',      len: ':60', Mo: 0, Tu: 0, We: 0, Th: 0, Fr: 0, Sa: 0, Su: 0 },
    { name: 'Afternoons (3p-6:30p)', len: ':60', Mo: 0, Tu: 0, We: 0, Th: 0, Fr: 0, Sa: 0, Su: 0 },
    { name: 'Sa-Su 9a-3p',          len: ':60', Mo: 0, Tu: 0, We: 0, Th: 0, Fr: 0, Sa: 0, Su: 0 },
    { name: 'M-Su 6a-12M Bonus',    len: ':60', Mo: 0, Tu: 0, We: 0, Th: 0, Fr: 0, Sa: 0, Su: 0 }
];

function lenOptions(cur) {
    return LENGTHS.map(function(l) {
        return '<option value="' + l + '"' + (cur === l ? ' selected' : '') + '>' + l + '</option>';
    }).join('');
}

function renderGrid() {
    var body = document.getElementById('gridBody');
    if (!body) return;
    body.innerHTML = '';

    rows.forEach(function(row, i) {
        var tr = document.createElement('tr');

        var dayCells = DAYS.map(function(d) {
            return '<td class="num-cell"><input type="number" min="0" max="99" value="' + (row[d] || 0) + '"></td>';
        }).join('');

        tr.innerHTML =
            '<td class="dp-name"><input type="text" value="' + row.name + '" placeholder="Daypart name"></td>' +
            '<td class="num-cell ads-week">0</td>' +
            '<td class="sel-cell"><select>' + lenOptions(row.len) + '</select></td>' +
            dayCells +
            '<td class="rate-cell"><input type="text" placeholder="0.00"></td>' +
            '<td class="cost-cell" style="color:#cc0000; font-weight:600; text-align:center;"></td>' +
            '<td class="del-cell"><button class="del-row-btn" onclick="deleteRow(' + i + ')">✕</button></td>';

        body.appendChild(tr);
    });

    getAllTotals();
}

// Returns number of weeks selected
function getSelectedWeeks() {
    var weekStart = document.getElementById('weekStart');
    var weekEnd   = document.getElementById('weekEnd');

    if (!weekStart || !weekEnd || !weekStart.value || !weekEnd.value) return 1;

    var startParts = weekStart.value.split('-W');
    var endParts   = weekEnd.value.split('-W');

    var startYear = parseInt(startParts[0]);
    var startWeek = parseInt(startParts[1]);
    var endYear   = parseInt(endParts[0]);
    var endWeek   = parseInt(endParts[1]);

    if (startYear === endYear) return Math.max(1, (endWeek - startWeek) + 1);
    return 1;
}

function calculateRow(tr) {
    var cells = tr.children;

    var adsPerWeek = 0;
    for (var i = 3; i <= 9; i++) {
        var input = cells[i].querySelector('input');
        adsPerWeek += parseInt(input ? input.value : 0) || 0;
    }

    var rateInput = cells[10].querySelector('input');
    var rate = parseFloat(rateInput ? rateInput.value : 0) || 0;

    var weeklyCost       = adsPerWeek * rate;
    var campaignCostAmount = weeklyCost * getSelectedWeeks();

    cells[1].textContent = adsPerWeek;
    cells[11].textContent = campaignCostAmount > 0 ? '$' + campaignCostAmount.toFixed(2) : '';

    return [adsPerWeek, weeklyCost, campaignCostAmount];
}

function getAllTotals() {
    var body = document.getElementById('gridBody');
    if (!body) return;

    var totalAds         = 0;
    var totalWeeklyCost  = 0;
    var totalCampaignCost = 0;

    body.querySelectorAll('tr').forEach(function(tr) {
        var result = calculateRow(tr);
        totalAds          += result[0];
        totalWeeklyCost   += result[1];
        totalCampaignCost += result[2];
    });

    var tAds  = document.getElementById('totalAds');
    var tCost = document.getElementById('totalCost');
    if (tAds)  tAds.innerText  = totalAds;
    if (tCost) tCost.innerText = '$' + totalCampaignCost.toFixed(2);

    var mAds  = document.getElementById('mainTotalAds');
    var mCost = document.getElementById('mainTotalCost');
    if (mAds)  mAds.innerText  = totalAds;
    if (mCost) mCost.innerText = '$' + totalWeeklyCost.toFixed(2);

    var campaignCost = document.getElementById('campaignCost');
    if (campaignCost) campaignCost.innerText = '$' + totalCampaignCost.toFixed(2);
}

document.addEventListener('input', function(e) {
    var body = document.getElementById('gridBody');
    if (body && body.contains(e.target)) getAllTotals();
});

function addRow() {
    rows.push({ name: 'New daypart', len: ':60', Mo: 0, Tu: 0, We: 0, Th: 0, Fr: 0, Sa: 0, Su: 0 });
    renderGrid();
}

function deleteRow(i) {
    rows.splice(i, 1);
    renderGrid();
}

function openScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'block';
    renderGrid();
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'none';
}

document.getElementById('scheduleModal').addEventListener('click', function(e) {
    if (e.target === this) closeScheduleModal();
});

// ── Get MONDAY of the ISO week (week starts Monday) ──
function getMondayOfWeek(value) {
    var parts = value.split('-W').map(Number);
    var year  = parts[0];
    var week  = parts[1];

    // Jan 4 is always in week 1 per ISO 8601
    var jan4  = new Date(year, 0, 4);
    var dow   = jan4.getDay() || 7;          // make Sunday = 7
    var monday = new Date(jan4);
    monday.setDate(jan4.getDate() - (dow - 1) + (week - 1) * 7);
    return monday;
}

function formatDate(date) {
    var month = date.toLocaleString('default', { month: 'short' });
    return month + ' ' + date.getDate();
}

document.addEventListener('DOMContentLoaded', function () {

    var startBtn  = document.getElementById('startWeekBtn');
    var endBtn    = document.getElementById('endWeekBtn');
    var weekStart = document.getElementById('weekStart');
    var weekEnd   = document.getElementById('weekEnd');

    if (!startBtn || !endBtn || !weekStart || !weekEnd) return;

    startBtn.addEventListener('click', function () {
        if (weekStart.showPicker) weekStart.showPicker();
        else weekStart.click();
    });

    endBtn.addEventListener('click', function () {
        if (weekEnd.showPicker) weekEnd.showPicker();
        else weekEnd.click();
    });

    weekStart.addEventListener('change', function () {
        if (!this.value) return;
        var monday = getMondayOfWeek(this.value);
        startBtn.textContent = formatDate(monday) + ' - Week 2026';
        getAllTotals();
    });

    weekEnd.addEventListener('change', function () {
        if (!this.value) return;
        var monday = getMondayOfWeek(this.value);
        endBtn.textContent = formatDate(monday) + ' - Week 2026';
        getAllTotals();
    });

});

// Station name → receipt panel
document.addEventListener('DOMContentLoaded', function () {

    function updateStationName() {
        var stationInput = document.getElementById('stationInput');
        var mainStation  = document.getElementById('mainStationName');
        if (!stationInput || !mainStation) return;
        mainStation.innerText = stationInput.value.trim() || '— Select station —';
    }

    document.addEventListener('input', function (e) {
        if (e.target && e.target.id === 'stationInput') updateStationName();
    });

    window.openScheduleModal = function () {
        document.getElementById('scheduleModal').style.display = 'block';
        renderGrid();
        updateStationName();
    };
});

// Re-run totals on confirm button click
document.addEventListener('DOMContentLoaded', function () {
    var confirmButton = document.getElementById('confirmButton');
    if (confirmButton) {
        confirmButton.addEventListener('click', function () {
            getAllTotals();
        });
    }
});
