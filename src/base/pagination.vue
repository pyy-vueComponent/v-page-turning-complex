<template>
    <div id="Pagination" v-if="totalPage > 1">
        <!--向前一页，当前页面为1时无法点击-->
        <button class="prev" v-if="isShowPrev" @click="prev">prev</button>

        <!--第1页，当页数大于0页时永久显示-->
        <button :class="{active: currentPage == 1}" @click="changePage(1)">1</button>
        
        <!--向前5页-->
        <button class="quick-prev" v-if="isShowQuickPrev" @click="quickPrev">...</button>
        
        <!--中间显示区的页码-->
        <!-- <button v-for="i in showingPages" @click="currentPage=i">{{i}}</button> -->
        <button v-for="i in showingPages" :class="{active: currentPage == i}" @click="changePage(i)">{{i}}</button>

        <!--向后5页-->
        <button class="quick-next" v-if="isShowQuickNext" @click="quickNext">...</button>

        <!--最后1页，当页数大于1页时永久显示-->
        <button :class="{active: currentPage == totalPage}" @click="changePage(totalPage)">{{totalPage}}</button>
       
        <!--向后一页，当前页面为最后一页时无法点击-->
        <button class="next" v-if="isShowNext" @click="next">next</button>
    </div>
</template>

<script>
export default {
	props: {
		// value: {
		// 	type: Number,
		// 	default: 1
		// },
		total: {
			type: Number,
			default: 0
		},
		limit: {
			type: Number,
			default: 3
		},
		// 快速切换的半径
		radius: {
			type: Number,
			default: 2
		}
	},
	computed: {
	  	totalPage() {
	  		return Math.ceil(this.total / this.limit);
	  	},
		showingPages() {
			var temp = [];
			if (this.isShowQuickPrev && this.isShowQuickNext) {
				for (var i = this.currentPage - this.radius; i <= this.currentPage + this.radius; i++) {
					temp.push(i);
				}
			} else if (this.isShowQuickPrev && !this.isShowQuickNext) {
				for (var i = this.totalPage - 2 * this.radius - 1; i < this.totalPage; i++) {
					temp.push(i);
				}
			} else if (!this.isShowQuickPrev && this.isShowQuickNext) {
				for (var i = 2; i < 7; i++) {
					temp.push(i);
				}
			} else if (!this.isShowQuickPrev && !this.isShowQuickNext) {
				for (var i = 2; i < this.totalPage; i++) {
					temp.push(i);
				}
			}
			return temp;
		},
	  	// currentPage: {
    //         get() {
    //         	return this.value;
    //         },
    //         set(val) {
    //         	this.$emit('input', val);
				// this.$emit('onRouter',val);
    //         }
	  	// },
	  	currentPage: {
	  		get() {
	  			return +this.$route.params.page;
	  		},
            set(val) {
            	this.changePage(val);
            }
	  	},
        isShowPrev() {
        	return this.currentPage > 1;
        },
        isShowNext() {
        	return this.currentPage < this.totalPage; 
        },
        isShowQuickPrev() {
        	return this.currentPage > 2 * this.radius + 1;
        },
        isShowQuickNext() {
            return this.currentPage < this.totalPage - 2 * this.radius;
        }
	},
	methods: {
		changePage(val) {
			this.$emit('onRouter',val);
		},
		prev() {
			const newPage = this.currentPage <= 1 ? 1 : this.currentPage - 1;
            this.$emit('onRouter', newPage);
		},
		next() {
			const newPage = this.currentPage >= this.totalPage ? this.totalPage : this.totalPage + 1; 
            this.$emit('onRouter', newPage);
		},
		quickPrev() {
			const newPage = this.currentPage >= 6 ? this.currentPage - 5 : 1;
            this.$emit('onRouter', newPage);
		},
		quickNext() {
			const newPage = this.currentPage <= this.totalPage -5 ? this.currentPage + 5 : this.totalPage;
			this.$emit('onRouter', newPage);
		}
	}
}
</script>

<style scoped>
#Pagination {
    overflow: hidden;
    display: inline-block;
}
button {
	float: left;
	background: transparent;
	border: 1px solid #666;
	font-size: 18px;
	width: 48px;
	height: 48px;
	line-height: 48px;
	border-radius: 6px;
	margin-right: 18px;
	color: #666;
}
button.active {
	color: #fff;
	border: none;
	background: #ff4900;
}


</style>