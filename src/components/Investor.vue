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