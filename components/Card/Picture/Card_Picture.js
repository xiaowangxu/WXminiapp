// components/Card_Text.js
Component({
    options: {
		addGlobalClass: true
	},
    /**
     * 组件的属性列表
     */
    properties: {
        idx: {
            type: Number,
            value: -1,
        },
        start: {
            type: String,
            value: 'unknown'
        },
        end: {
            type: String,
            value: 'unknown'
        },
        week: {
            type: Array,
            value: [true, true, true, true, true, true, true]
        },
        list: {
            type: Array,
            value: [{
                path: ''
            }],
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        imageList: []
    },

    /**
     * 组件的方法列表
     */
    methods: {
        select_Pictures: function () {
            const that = this
            wx.chooseImage({
                sourceType: '拍照或相册',
                sizeType: '压缩或原图',
                count: 9,
                success(res) {
                    console.log(res)
                    that.setData({
                        list: res.tempFilePaths
                    })
                    that.triggerEvent('datachange',{idx: that.properties.idx, start: this.properties.start, end: this.properties.end, week: this.properties.week, data: {type: 'Picture', data: that.properties.list}}, {})
                }
            })
        },

        saveFile() {
            if (this.data.tempFilePath.length > 0) {
                const that = this
                wx.saveFile({
                    tempFilePath: this.data.tempFilePath,
                    success(res) {
                        that.setData({
                            savedFilePath: res.savedFilePath
                        })
                        wx.setStorageSync('savedFilePath', res.savedFilePath)
                    },
                    fail() {
                        that.setData({
                            dialog: {
                                title: '保存失败',
                                content: '应该是有 bug 吧',
                                hidden: false
                            }
                        })
                    }
                })
            }
        },

        previewImage(e) {
            const current = e.target.dataset.src

            wx.previewImage({
                current,
                urls: this.properties.list
            })
        },

        change_Time: function () {
            this.triggerEvent('timechange', {idx: this.properties.idx}, {})
        } 
    }
})