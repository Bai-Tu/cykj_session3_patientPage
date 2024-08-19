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
                    <el-menu-item>个人中心</el-menu-item>
                    <el-menu-item v-show="!isLogin" @click="goLogin">登陆/注册</el-menu-item>
                    <el-dropdown v-show="isLogin">
                        <i class="el-icon-s-custom" style="margin-right: 15px;cursor:default;">
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>修改密码</el-dropdown-item>
                                <el-dropdown-item @click="quite">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                            <span style="color: wheat;">{{ this.$store.getters.getAdmin.patientName
                                }}</span>
                        </i>
                    </el-dropdown>
                </el-menu>
            </div>
        </el-header>
        <el-main v-loading="mainLoading">
            <h1>个人中心</h1>
            <div id="mainDiv">
                <div id="patientIndex">
                    <h3>个人信息</h3>
                    <el-form label-position="left" label-width="80px" :model="patient">
                        <el-form-item label="名字:">
                            <el-input v-model="patient.patientName" disabled style="width: 80%;"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄:">
                            <el-input v-model="patient.patientAge" disabled style="width: 80%;"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证:">
                            <el-input v-model="patient.patientIdentity" disabled style="width: 80%;"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码:">
                            <el-input v-model="patient.patientPhone" disabled style="width: 80%;"></el-input>
                        </el-form-item>
                        <el-form-item label="余额:">
                            <el-input v-model="patient.patientBuddget" disabled style="width: 80%;"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" @click="openForm">修改信息</el-button>
                    <el-button type="success" @click="openAddForm">充值</el-button>
                </div>


                <div id="orderIndex">
                    <el-table :data="tableData" style="width: 100%" v-loading="loading" stripe>
                        <el-table-column prop="orderNumber" label="订单号" width="250">
                        </el-table-column>
                        <el-table-column prop="orderCreateTime" label="创建时间" width="200" :formatter="timeMatter">
                        </el-table-column>
                        <el-table-column prop="orderStatus" label="状态" width="100" :formatter="statusMatter">
                        </el-table-column>
                        <el-table-column prop="orderPrice" label="价格(￥)" width="100">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-popconfirm title="确认结账吗？" @confirm="checkOut(scope.row)">
                                    <el-button type="success" :disabled="scope.row.orderStatus == 1" slot="reference">
                                        结账
                                    </el-button>
                                </el-popconfirm>
                                <el-button type="primary" slot="reference" style="margin-left: 20px;"
                                    @click="goDiagnose(scope.row)" :disabled="scope.row.orderStatus == 0">
                                    查询报告
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination layout="prev, pager, next" :total=total :page-size="pageSize"
                            @current-change="handleCurrentChange" :current-page="currentPage">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-main>

        <el-dialog title="充值" :visible.sync="addBudgetVisible" width="400px">
            <span>充值金额：</span>
            <el-input v-model="addBUdgetNum" style="width: 70%;"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBudgetVisible = false">取 消</el-button>
                <el-button type="primary" @click="addBudgetCommit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="400px">
            <el-form :model="dialogForm">
                <el-form-item label="名字" label-width="100px">
                    <el-input v-model="dialogForm.patientName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" label-width="100px">
                    <el-input v-model="dialogForm.patientAge" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证" label-width="100px">
                    <el-input v-model="dialogForm.patientIdentity" autocomplete="off"
                        :disabled="dialogForm.patientIdentity != '' && dialogForm.patientIdentity != undefined"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="dialogForm.patientPhone" autocomplete="off"
                        :disabled="dialogForm.patientPhone != '' && dialogForm.patientPhone != undefined"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitForm">确 定</el-button>
            </div>
        </el-dialog>


        <el-drawer title="结果报告" :visible.sync="drawerVisible" direction="rtl" size=500 v-loading="drawerLoading">
            <el-table :data="drawerData" style="width: 100%" v-loading="loading" stripe>
                <el-table-column prop="subitemName" label="细项名" width="150">
                </el-table-column>
                <el-table-column prop="subitemConclution" label="细项结果" width="100">
                </el-table-column>
                <el-table-column prop="subitemStandardMin" label="最小值" width="100">
                </el-table-column>
                <el-table-column prop="subitemStandardMax" label="最大值" width="100">
                </el-table-column>
            </el-table>
            <div>
                <h2>总结</h2>
                <el-input disabled style="width: 80%" placeholder="暂无总结" v-model="orderConclution"></el-input>
            </div>
        </el-drawer>


    </el-container>

</template>

<script>
import { removeToken } from '@/utils/authToken'
import { defaultSuccess, successInMsg } from '@/api/successNoties'
import { FailInMsg } from '@/api/errorNoties';
import { blockForThreeSeconds } from '@/api/outherTools';

export default {
    data() {
        return {
            addBudgetVisible: false,
            mainLoading:false,
            addBUdgetNum: "",
            isLogin: false,
            drawerVisible: false,
            dialogFormVisible: false,
            loading: false,
            drawerLoading: false,
            total: 1,
            currentPage: 1,
            pageSize: 8,
            patient: {},
            dialogForm: {
                patientName: "",
                patientIdentity: "",
                patientPhone: "",
                patientAge: ""
            },
            drawerData: [],
            tableData: [],
            orderConclution: ""
        }
    },
    mounted() {
        this.patient = this.$store.getters.getAdmin
        if (this.$store.getters.getAdmin.patientName != undefined) {
            this.isLogin = true
        }
        this.getOrder()
    },
    methods: {
        //获取数据 
        getOrder() {
            this.loading = true
            this.$axios.post(
                "/patient1/getOrderListByIdInPage",
                {
                    pagen: this.currentPage,
                    limit: this.pageSize,
                    id: this.patient.patientId
                }
            ).then((res) => {
                this.loading = false
                this.tableData = res.data.list
                this.total = res.data.total
            })
        },
        goDiagnose(res) {
            this.drawerVisible = true;
            this.drawerLoading = true;
            this.$axios.post(
                "/patient1/getOrderIndex",
                {
                    orderNumber: res.orderNumber
                }
            ).then(response1 => {
                this.drawerData = response1.data;

                // 返回第二个请求的 Promise
                return this.$axios.post(
                    "/patient1/getOrderConclution",
                    {
                        orderNumber: res.orderNumber
                    }
                );
            }).then(response2 => {
                this.orderConclution = response2.data.conclutionContent;
                this.drawerLoading = false;
            }).catch(error => {
                // 处理任何请求或响应中的错误
                console.error('Error:', error);
                // 你可以根据需要在这里设置错误状态
            });
        },
        checkOut(res) {
            this.loading = true;
            this.$axios.post(
                "/patient1/checkOutOrder",
                {
                    patientId: this.patient.patientId,
                    orderNumber: res.orderNumber,
                    orderPrice: res.orderPrice,
                    orderId: res.orderId,
                }
            ).then((res) => {
                this.loading = false;
                if (res.code == 1) {
                    successInMsg("结账成功")
                    blockForThreeSeconds().then(()=>{
                        location.reload()
                    })
                } else if (res.code == -2) {
                    FailInMsg("余额不足")
                } else {
                    FailInMsg("服务器故障")
                }

            })
        },
        // 修改信息
        commitForm() {
            this.$axios.post(
                "/patient1/updatePatient",
                {
                    patientId: this.patient.patientId,
                    patientName: this.dialogForm.patientName,
                    patientIdentity: this.dialogForm.patientIdentity,
                    patientPhone: this.dialogForm.patientPhone,
                    patientAge: this.dialogForm.patientAge
                }
            ).then((res) => {
                if (res.code == 1) {
                    this.$store.commit("setAdmin", res.data)
                    this.dialogFormVisible = false
                    successInMsg("修改成功");
                    blockForThreeSeconds().then(()=>{
                        location.reload()
                    })
                }
            })

        },
        addBudgetCommit() {
            // this.$axios.post(
            //     "/pay/alipay",
            //     {
            //         total_amount: this.addBUdgetNum
            //     }
            // ).then((res) => {
            //     console.log(res);
            //     this.iframeSrc = res.data.msg;
            //     // const div = document.createElement('div')
            //     // div.innerHTML = res.data.msg
            //     // document.body.appendChild(div)
            //     // document.forms[0].submit() //重要，这个才是点击跳页面的核心

            // });

            this.$router.push({
                path: '/payment',
                query: {
                    total_amount: this.addBUdgetNum,
                    patientId:this.patient.patientId
                }
            })

        },
        openForm() {
            this.dialogFormVisible = true;
            this.dialogForm.patientAge = this.patient.patientAge;
            this.dialogForm.patientName = this.patient.patientName;
            this.dialogForm.patientIdentity = this.patient.patientIdentity;
            this.dialogForm.patientPhone = this.patient.patientPhone


        },
        openAddForm() {
            this.addBUdgetNum = ""
            this.addBudgetVisible = true;
        },
        // 辅助方法
        handleCurrentChange(index) {
            this.currentPage = index
            this.getOrder()
        },
        statusMatter(row, colum, cellValue) {
            return cellValue == 1 ? "已付款" : "未付款"
        },
        timeMatter(row, colum, cellValue) {
            let myDate = new Date(cellValue);
            return myDate.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },
        quite() {
            removeToken()
            defaultSuccess()
        },
        // 跳转
        goLogin() {
            this.$router.push(
                "/login"
            )
        },
        back() {
            this.$router.push(
                "/main"
            )
        }
    }


}



</script>

<style scoped>
.el-input {
    font-size: 16px;
}

#mainDiv {
    position: relative;
    width: 100%;
    height: 100vh;
}

#patientIndex {
    position: absolute;
    left: 3%;
    width: 30%;
    height: 500px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

#orderIndex {
    position: absolute;
    right: 3%;
    width: 60%;
    height: 600px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}





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
    width: 700px;
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

<style>
.el-carousel__arrow--left {
    left: 20%;
}

.el-carousel__arrow--right {
    right: 20%;
}
</style>