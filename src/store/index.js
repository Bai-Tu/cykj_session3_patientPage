import Vue from 'vue'
import Vuex from "vuex";
import http from '@/utils/request';
import { getToken } from '@/utils/authToken';

Vue.use(Vuex);

var store = new Vuex.Store({//开启状态管理器
    state:{
        admin:{},
        patientId:""
    },
    getters:{
        getAdmin(state){
            return state.admin
        },
        getPatientId(state){
            return state.patientId
        }
    },
    mutations:{
        setAdmin(state,newAdmin){
            state.admin = newAdmin;
        },
        setPatientId(state,newPatientId){
            state.patientId = newPatientId
        }
    },
    actions:{
        setAdmin(store,newAdmin){
            store.commit('setAdmin',newAdmin);
        },
        setPatientId(store,newPatientId){
            store.commit("setPatientId",newPatientId)
        },
        async getAdminInfo(store){
            return await http.get(
                "/tool1/parseToken",
                {
                    params:{
                        token:getToken()
                    }
                }
            ).then(res => {
                if(res){
                    if(res.code != -200){
                        store.commit("setAdmin",res.data.adminInfo);
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                
            })
        }
    }
})


export default store;