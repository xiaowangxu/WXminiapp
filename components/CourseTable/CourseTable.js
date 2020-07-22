// components/CourseTable/CourseTable.js
const util = require("../../utils/util.js")

Component({
	// behaviors: ['wx://component-export'],
	// export() {
	//   return this.refresh
	// },
	options: {
		addGlobalClass: true
	},

	lifetimes: {
		ready: function () {
			this.refresh()
		}
	},
    /**
     * 组件的属性列表
     */
	properties: {
		courses: {
			type: Array,
			value: []
		}
	},

    /**
     * 组件的初始数据
     */
	data: {
		currentCourse: null,
		currentTime: '',
		colorPalettes: getApp().globalData.colorPalettes
	},

    /**
     * 组件的方法列表
     */
	methods: {
		tap_Course: function (event) {
			let name = event.currentTarget.dataset.coursename
			getApp().navigateTo_Table(name, name, '课程表')
		},

		get_Course: function (week, day, time) {
			for (let i = 0; i < this.properties.courses.length; i++) {
				let course = this.properties.courses[i]
				if (!course.week.includes(week)) {
					continue
				} else {
					for (let j = 0; j < course.times.length; j++) {
						let coursetime = course.times[j]
						if (coursetime.day != day) {
							continue
						}
						// console.log(time, coursetime)
						let courseweek = course.week
						if (coursetime.timestart <= time && time <= coursetime.timeend) { // 在这里添加对周数的判断 => courseweek.include(当前周数 以1开始)
							return {
								course: { name: course.name, property: course.property, timestart: coursetime.timestart, timeend: coursetime.timeend },
								color: this.data.colorPalettes[i % this.data.colorPalettes.length]
							}
						}
					}
				}
			}
			return null
		},

		get_Next_Course: function (week, day, date) {
			let formeteddate = util.getTimeFiexdDate(date)
			let lastcourse = null
			let lastcoursetime = -1
			let index = -1
			for (let i = 0; i < this.properties.courses.length; i++) {
				let course = this.properties.courses[i]
				if (!course.week.includes(week)) {
					continue
				} else {
					for (let j = 0; j < course.times.length; j++) {
						let coursetime = course.times[j]
						if (coursetime.day != day) {
							continue
						}
						let coursestart = util.getCourseTime(coursetime.timestart)
						let courseend = util.getCourseTime(coursetime.timeend)
						let courseweek = course.week
						if (formeteddate < coursestart.start || formeteddate < courseend.end) { // 在这里添加对周数的判断 => courseweek.include(当前周数 以1开始)
							// console.log(">> ", course)
							if (lastcourse === null) {
								lastcourse = {
									course: { name: course.name, property: course.property, timestart: coursetime.timestart, timeend: coursetime.timeend },
									color: this.data.colorPalettes[i % this.data.colorPalettes.length]
								}
								lastcoursetime = coursetime.timestart
								index = i
							}
							else if (coursetime.timestart < lastcoursetime) {
								lastcourse = {
									course: { name: course.name, property: course.property, timestart: coursetime.timestart, timeend: coursetime.timeend },
									color: this.data.colorPalettes[i % this.data.colorPalettes.length]
								}
								lastcoursetime = coursetime.timestart
								index = i
							}
						}
					}
				}
			}
			if (lastcourse === null) {
				return null
			}
			else {
				return lastcourse
			}
		},

		refresh: function () {
			let courses = this.properties.courses
			// let date = new Date('2020/7/13 13:52:00')
			let date = new Date()
			let day = util.getDay(date)
			let coursetime = util.getCourse(date)

			// console.log(coursetime)

			let currentCourse = this.get_Course(1, day, coursetime)
			if (currentCourse !== null) {
				currentCourse.formattedtime = util.getCourseTimeDuratiomFormated(currentCourse.course.timestart, currentCourse.course.timeend)
			}

			let nextCourse = this.get_Next_Course(1, day, date)
			// console.log(">>", nextCourse)
			if (nextCourse !== null) {
				nextCourse.formattedtime = util.getCourseTimeDuratiomFormated(nextCourse.course.timestart, nextCourse.course.timeend)
			}

			this.setData({
				currentCourse: currentCourse,
				nextCourse: nextCourse
			})
			// console.log(">", this.data.currentCourse)
		}
	}
})