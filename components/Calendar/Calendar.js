Component({

    properties: {
        defaultValue: {
            type: String,
            value: ''
        },

        weekText: {
            type: Array,
            value: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        },
        lastMonth: {
            type: String,
            value: '◀'
        },
        nextMonth: {
            type: String,
            value: '▶'
        }
    },


    data: {

        thisMonthDays: [],
        empytGridsBefore: [],
        empytGridsAfter: [],
        title: '',
        format: '',

        year: 0,
        month: 0,
        date: 0,

        YEAR: 0,
        MONTH: 0,
        DATE: 0
    },
    ready: function () {
        this.today();
    },

    methods: {
        display: function (year, month, date) {
            this.setData({
                year,
                month,
                date,
                title: year + '年' + this.zero(month) + '月'
            })
            this.createDays(year, month);
            this.createEmptyGrids(year, month);
        },

        today: function () {
            let DATE = this.data.defaultValue ? new Date(this.data.defaultValue) : new Date(),
                year = DATE.getFullYear(),
                month = DATE.getMonth() + 1,
                date = DATE.getDate(),
                select = year + '-' + this.zero(month) + '-' + this.zero(date);

            this.setData({
                format: select,
                select: select,
                year: year,
                month: month,
                date: date,
                YEAR: year,
                MONTH: month,
                DATE: date,
            })

            this.display(year, month, date);
        },

        select: function (e) {
            let date = e.currentTarget.dataset.date,
                select = this.data.year + '-' + this.zero(this.data.month) + '-' + this.zero(date);
            //     url = '../Table/Table';
            // wx.navigateTo({
            //     url: url,
            // });
            this.setData({
                title: this.data.year + '年' + this.zero(this.data.month) + '月' + this.zero(date) + '日',
                select: select,
                year: this.data.year,
                month: this.data.month,
                date: date
            });
        },

        lastMonth: function () {
            let month = this.data.month == 1 ? 12 : this.data.month - 1;
            let year = this.data.month == 1 ? this.data.year - 1 : this.data.year;

            this.display(year, month, 0);
        },

        nextMonth: function () {
            let month = this.data.month == 12 ? 1 : this.data.month + 1;
            let year = this.data.month == 12 ? this.data.year + 1 : this.data.year;

            this.display(year, month, 0);
        },

        getThisMonthDays: function (year, month) {
            return new Date(year, month, 0).getDate();
        },

        createDays: function (year, month) {
            let thisMonthDays = [],
                days = this.getThisMonthDays(year, month);
            for (let i = 1; i <= days; i++) {
                thisMonthDays.push({
                    date: i,
                    dateFormat: this.zero(i),
                    monthFormat: this.zero(month),
                    week: this.data.weekText[new Date(Date.UTC(year, month - 1, i)).getDay()]
                });
            }
            this.setData({
                thisMonthDays
            })
        },

        createEmptyGrids: function (year, month) {
            let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
                empytGridsBefore = [],
                empytGridsAfter = [],
                emptyDays = (week == 0 ? 7 : week);

            var thisMonthDays = this.getThisMonthDays(year, month);

            var preMonthDays = month - 1 < 0 ?
                this.getThisMonthDays(year - 1, 12) :
                this.getThisMonthDays(year, month - 1);

            for (let i = 1; i <= emptyDays; i++) {
                empytGridsBefore.push(preMonthDays - (emptyDays - i));
            }

            var after = (42 - thisMonthDays - emptyDays) - 7 >= 0 ?
                (42 - thisMonthDays - emptyDays) - 7 :
                (42 - thisMonthDays - emptyDays);
            for (let i = 1; i <= after; i++) {
                empytGridsAfter.push(i);
            }
            this.setData({
                empytGridsAfter,
                empytGridsBefore
            })
        },

        zero: function (i) {
            return i >= 10 ? i : '0' + i;
        },
    }
})