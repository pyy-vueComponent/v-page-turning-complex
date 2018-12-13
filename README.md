# v-page-turning-complex

> A Vue.js project

# vue实现可复用的翻页组件

接口地址： 

`http://test.pandanc.com/api/v1/projects/project/`

`http://test.pandanc.com/api/v1/invest/invest-agency/`

浏览器访问如下：

`http://localhost:8080/project/library/:page`

`http://localhost:8080/investor/library/6`


**翻页思路**

1. 翻页的时候通过改变url上params参数page
2. 路由参数page改变，刷新页面
3. 刷新页面的的时候，created 重新请求数据，getProjects(page)

**解决 'library/:page' 中page改变不刷新的问题**

通过给router-view添加一个动态变化的参数，让Vue认为这个组件每一次都是一个新组件，从而重新刷新。

[router-view 复用时组件不刷新的解决办法](https://www.jianshu.com/p/9911c15faa10)

# pagination demo

src/router/index.js

```js
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Project from '@/components/Project'
import Investor from '@/components/Investor'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/project',
      redirect: '/project/library/1',
      name: 'Project',
      component: Project,
      children: [{
      	path: 'library/:page',
      	component: Project,
      }]
    },
    {
      path: '/investor',
      redirect: '/investor/library/1',
      name: 'Investor',
      component: Investor,
      children: [{
        path: 'library/:page',
        component: Investor,
      }]
    }
  ]
})
```

src/base/pagination.vue

```html
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
```

src/components/Project.vue

```html
<template>
  <div class="project">
    <h1></h1>
    <div class="pagination-section">
    	<Pagination :total="total" :limit="limit" @onRouter="turnPage"></Pagination>
    </div>
    <ul class="project-section">
      <li v-for="item in projects">
        <h2>{{item.name}}</h2>
        <img class="img-project" :src="item.cover_image" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import Pagination from '@/base/pagination';
export default {
	components: {
		Pagination
	},
  data () {
    return {
      msg: 'Welcome to Project',
      token:'',
      limit: 3,
      projects: [],
      defaultOrdering: '-upload_date',
      currentPage: parseInt(this.$route.params.page),
      total: 0
    }
  },

  mounted() {
    this.getProjects();
  },
  methods: {
    // 翻页
    turnPage(page = 1) {
      this.$router.push(`/project/library/${page}`);
    },

    // 获取项目数据
    getProjects(page=this.currentPage) {
      // 首先获取一个token
      this.$axios.post('http://test.pandanc.com/api/v1/accounts/rest-auth/login/',{
        username: 'pengyouyi',
        password: 'pengyouyi'
      }).then( res=> {
        this.token = res.data.token;
        // 获取projects
        this.$axios.get('http://test.pandanc.com/api/v1/projects/project/', {
          params: {
            limit: this.limit,
            offset: this.limit * (page - 1),
            ordering: this.defaultOrdering
          },
          headers: {
            Authorization: `JWT ${this.token}`
          },
        }).then( res=> {
        	this.projects = [];
        	this.total = res.data.count;
            this.projects = res.data.results;
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err);
      })
    },

  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
.pagination-section {
  text-align: center;
}
.project-section li {
  float: left;
  margin-right: 30px;
}
.img-project {
  width: 300px;
  height: 300px;
}
</style>
```

src/components/Investor.vue

```html
<template>
  <div class="project">
    <h1></h1>
    <div class="pagination-section">
    	<Pagination :total="total" :limit="limit" @onRouter="turnPage"></Pagination>
    </div>
    <ul class="project-section">
      <li v-for="item in projects">
        <h2>{{item.name}}</h2>
        <img class="img-project" :src="item.logo" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import Pagination from '@/base/pagination';
export default {
	components: {
		Pagination
	},
  data () {
    return {
      msg: 'Welcome to Project',
      token:'',
      limit: 9,
      projects: [],
      defaultOrdering: '-upload_date',
      currentPage: parseInt(this.$route.params.page),
      total: 0
    }
  },

  mounted() {
    this.getInvestors();
  },
  methods: {
    // 翻页
    turnPage(page = 1) {
      this.$router.push(`/investor/library/${page}`);
    },

    // 获取项目数据
    getInvestors(page=this.currentPage) {
      // 首先获取一个token
      this.$axios.post('http://test.pandanc.com/api/v1/accounts/rest-auth/login/',{
        username: 'pengyouyi',
        password: 'pengyouyi'
      }).then( res=> {
        this.token = res.data.token;
        // 获取projects
        this.$axios.get('http://test.pandanc.com/api/v1/invest/invest-agency/', {
          params: {
            limit: this.limit,
            offset: this.limit * (page - 1),
            ordering: this.defaultOrdering
          },
          headers: {
            Authorization: `JWT ${this.token}`
          },
        }).then( res=> {
        	this.projects = [];
        	this.total = res.data.count;
            this.projects = res.data.results;
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err);
      })
    },

  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
.pagination-section {
  text-align: center;
}
.project-section li {
  float: left;
  margin-right: 30px;
}
.img-project {
  width: 100px;
  height: 100px;
}
</style>
```

src/main.js 新增

```
import axios from 'axios';

Vue.prototype.$axios = axios;
```

# more

- 完整项目请看github, 项目v-page-turning-complex待上传，地址待添加。。。