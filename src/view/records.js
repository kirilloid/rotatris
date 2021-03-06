define('view/records', ['model/records', 'Keyboard', 'utils'], function (Records, Keyboard, Utils) {
    function RecordsView () {
        this.data = new Records();
    }
    var el = window.records;
    var header = el.innerHTML;
    Utils.extend(RecordsView.prototype, {
        drawTable: function () {
            el.innerHTML = header + this.data.table.map(function (record, idx) {
                var out = idx >= 10;
                return '<tr' + (out ? ' style="color:#ccc;"' : '') + '><td>' + (out ? '' : idx + 1) + '</td><td>' + record.name + '</td><td class="score">' + record.points + '</td></tr>';
            }).join('');
        },
        drawWith: function (points, callback) {
            var data = this.data;
            var pos = data.position(points);
            if (pos < 10) {
                data.add('<form><input maxlengh=20></form>', points, pos);
            } else {
                data.add('<em>Your score</em>', points, 10);
            }
            this.drawTable();
            var form = el.querySelector('form');
            if (!form) {
                callback();
                return;
            }
            Keyboard.disable();
            form.onsubmit = function submit (event) {
                if (event) { event.preventDefault(); }
                var parent = this.parentNode;
                var name = this.firstChild.value;
                parent.textContent = name;
                name = parent.innerHTML;
                data.table[pos].name = name;
                data.save();
                Keyboard.enable();
                callback();
            };
            var input = el.querySelector('input');
            input.onblur = function () {
                if (this.value !== '') {
                    this.parentNode.onsubmit();
                }
            };
            input.focus();
        }
    });
    return RecordsView;
});
