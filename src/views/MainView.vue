<template>

    <el-container>
        <el-header>
            <div id="header_icon">
                <img src="../../public/icon.png" height="30px">
                <span>体 检 系 统</span>
            </div>
            <div id="header_a_list">
                <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item @click="back">首页</el-menu-item>
                    <el-menu-item @click="getPatient">个人中心</el-menu-item>
                    <el-menu-item v-show="!isLogin" @click="goLogin">登陆/注册</el-menu-item>
                    <el-dropdown v-show="isLogin">
                        <i class="el-icon-s-custom" style="margin-right: 15px;cursor:default;">
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>修改密码</el-dropdown-item>
                                <el-dropdown-item @click.native="quite">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                            <span style="color: wheat;">{{ patientName
                                }}</span>
                        </i>
                    </el-dropdown>
                </el-menu>

            </div>
        </el-header>
        <el-main>
            <template>
                <el-carousel height="460px">
                    <el-carousel-item v-for="item in 2" :key="item">
                        <!-- <img :src="`../../public/banner${item}.png`">
                        <img src="../../public/banner1.png" alt=""> -->
                        <img :src="require(`../../public/banner${item}.png`)" alt="Banner">
                    </el-carousel-item>
                </el-carousel>
            </template>

            <div id="main_uldiv">
                <ul id="div_ul">
                    <li>
                        <a href="#/patient">
                            <span>个人中心</span>
                        </a>
                    </li>

                    <li>
                        <a href="#/patient">
                            <span>去体检</span>
                        </a>
                    </li>

                </ul>
            </div>

        </el-main>
    </el-container>


</template>

<script>
import { removeToken } from '@/utils/authToken'
import { defaultSuccess } from '@/api/successNoties'
import { blockForThreeSeconds } from '@/api/outherTools';

export default {
    data() {
        return {
            isLogin: false, 
        }
    },
    computed:{
        patientName() {return this.$store.getters.getAdmin.patientName} 
    },
    mounted() {
        this.getAdminINFO()
        console.log("patientName",this.$store.getters.getAdmin.patientName);
        
        if (this.$store.getters.getAdmin.patientName != undefined) {
            this.isLogin = true
        }
        this.$forceUpdate()
    },
    methods: {
        async getAdminINFO() {
            await this.$store.dispatch("getAdminInfo")
        },
        quite() {
            removeToken()
            defaultSuccess()
            blockForThreeSeconds().then(() => {
                location.reload()
            })
        },
        // 跳转
        goLogin() {
            this.$router.push(
                "/login"
            )
        },
        back() {
            location.reload()
        },
        getPatient() {
            if (this.isLogin == true) {
                this.$router.push(
                    "/patient"
                )
            } else {
                alert("请先登录");
                this.$router.push(
                    "/login"
                )
            }
        }
    }


}



</script>

<style scoped>
#main_uldiv {
    display: flex;
    /* 使用 Flexbox 布局 */
    justify-content: center;
    /* 水平居中对齐内容 */

}

#div_ul {
    list-style: none;
    width: 1600px;
    margin: 0, auto;
}

#div_ul>li {
    width: 48%;
    height: 280px;
    float: left;
    margin-right: 20px;
    background-image: url("../../public/banback.png");
    border-radius: 5px;
    /* 设置圆角 */
    cursor: pointer;
    /* 设置鼠标悬停时的样式 */
}

#div_ul>li>a {
    text-decoration: none;
    /* 去掉下划线 */
    color: inherit;
    /* 继承父元素的颜色 */
    display: block;
    /* 使整个li可点击 */
    height: 100%;
    /* 确保a标签填满整个li */
}

#div_ul>li>a>span {
    display: block;
    /* 使span块级显示 */
    text-align: center;
    /* 中央对齐文字 */
    font-size: 60px;
    /* 设置字体大小 */
    line-height: 1.5;
    /* 行高 */
}

.el-icon-s-custom {
    color: white;
}

.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    background-color: #545c64;
}

#header_icon {
    background-color: #545c64;
    position: absolute;
    left: 3%;
    height: 50px;
}

#header_icon>img {
    position: relative;
    top: 5px;
}

#header_icon>span {
    position: relative;
    font-size: 25px;
    color: white;
}

#header_a_list {
    position: absolute;
    right: 2%;
}

.el-menu-item {
    margin-right: 30px;
}

.my-carousel {
    width: 80%;
    /* 设置宽度，可以根据需要调整百分比或固定值 */
    margin: 0 auto;
    /* 居中对齐 */
}

.my-carousel .el-carousel__item {
    display: flex;
    /* 使用 Flexbox 来居中对齐图片 */
    align-items: center;
    /* 垂直居中对齐内容 */
    justify-content: center;
    /* 水平居中对齐内容 */
}

.my-carousel img {
    max-width: 100%;
    /* 确保图片宽度不超出容器 */
    max-height: 100%;
    /* 确保图片高度不超出容器 */
    object-fit: cover;
    /* 保持图片比例填满容器 */
}
</style>
