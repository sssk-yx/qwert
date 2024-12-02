<template>
    <div>
        <el-card>
            <el-button type="primary" @click="addTrademark" v-has="`btn.Trademark.add`"><i-ep:plus
                    style="margin-right: 3px; margin-bottom:1px ;" />
                添加品牌</el-button>
            <el-table :data="trademarkList" border>
                <el-table-column align="center" type="index" label="序号" width="100px"></el-table-column>
                <el-table-column align="center" label="品牌名称">
                    <template #="{ row: { tmName } }">
                        <span style="font-weight: 700">{{ tmName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="品牌LOGO">
                    <template #="{ row: { logoUrl } }">
                        <img :src="logoUrl" alt="" style="height: 80px; width: 80px">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="品牌操作">
                    <template #="{ row, $index }">
                        <el-button type="warning" icon="Edit" size="small" @click="editTrademark(row)"></el-button>
                        <el-popconfirm width="200" icon="Delete" cancel-button-type="success"
                            confirm-button-type="danger" :title="`确定要删除${row.tmName}吗?`"
                            @confirm="deleteTrademark(row.id)">
                            <template #reference>
                                <el-button type="danger" icon="Delete" size="small"></el-button>
                            </template>
                        </el-popconfirm>

                    </template>

                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper,->,sizes, total" :total="total"
                hide-on-single-page />
        </el-card>
        <!-- 对话框 -->
        <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="500" :before-close="dialogBeforeClose">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" label-position="right">
                <el-form-item label="品牌名称" prop="tmName">
                    <el-input v-model="form.tmName" />
                </el-form-item>
                <el-form-item prop="logoUrl" label="品牌LOGO">
                    <!-- upload组件属性:action图片上传路径书写/api,代理服务器不发送这次post请求  -->
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="confirm">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';

//已有品牌数据列表
let trademarkList = ref<Records>([]);
//分页器相关数据
//当前页码
let currentPage = ref(1);
//每页条数
let pageSize = ref(3)
//总条数
let total = ref(0)

//当currentPage发生改变时重新获取已有品牌数据列表
watch(currentPage, () => {
    getHasTrademark();
})
//当pageSize发生改变时currentPage重置为1,防止当前的currentPage值因为pageSize的改变而超出总页数
watch(pageSize, () => {
    currentPage.value = 1;
    getHasTrademark();
})
//获取已有品牌数据列表
const getHasTrademark = async () => {
    const { data }: TradeMarkResponseData = await reqHasTrademark(currentPage.value, pageSize.value);
    trademarkList.value = data.records;
    total.value = data.total;
}
onMounted(() => {
    getHasTrademark();
})

//对话框相关
//对话框表单是否显示
let dialogFormVisible = ref(false);
//对话框标题
let dialogFormTitle = ref('');
//品牌信息表单数据
let form = ref({
    id: 0,
    tmName: '',
    logoUrl: ''

})
//获取diaLogForm的模板引用
let formRef = ref();

//添加品牌按钮回调函数
const addTrademark = () => {
    dialogFormTitle.value = '添加品牌';
    dialogFormVisible.value = true;
}
//编辑品牌按钮回调函数
const editTrademark = ({ id, tmName, logoUrl }) => {
    dialogFormTitle.value = '修改品牌';
    dialogFormVisible.value = true;
    //将品牌信息传入表单数据
    form.value = { id, tmName, logoUrl }
}
//删除品牌按钮回调函数
const deleteTrademark = async (id) => {
    let result = await reqDeleteTrademark(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除品牌成功'
        })
        //再次发请求获取已有全部的品牌数据
        //当前页数据删完后,回到上一页, 此功能分页器组件已自带
        getHasTrademark();
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败'
        })
    }
}

//对话框底部取消按钮
const cancel = () => {
    //对话框隐藏
    dialogFormVisible.value = false;
    //重置表单数据和验证结果
    resetForm();
}
//对话框底部确认按钮
const confirm = async () => {
    //在你发请求之前,要对于整个表单进行校验
    //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
    //利用try catch捕获校验失败的异常
    try {
        await formRef.value.validate()
        let result = await reqAddOrUpdateTrademark(form.value);
        //添加|修改已有品牌
        if (result.code == 200) {
            //关闭对话框
            dialogFormVisible.value = false;
            //弹出提示信息
            ElMessage({
                type: 'success',
                message: `${dialogFormTitle.value}成功`
            });
            //再次发请求获取已有全部的品牌数据
            //如果是添加品牌则回到第一页
            if (dialogFormTitle.value == '添加品牌') {
                currentPage.value = 1;
            }
            getHasTrademark();
        } else {
            //添加品牌失败
            ElMessage({
                type: 'error',
                message: `${dialogFormTitle.value}失败`
            });
        }
        //关闭对话框
        dialogFormVisible.value = false;
        //重置表单数据和验证结果
        resetForm();
    } catch { }
}
//对话框关闭之前的回调
const dialogBeforeClose = (done) => {
    //关闭对话框之前重置表单数据和验证结果
    resetForm();
    done();
}
//重置表单数据和验证
const resetForm = () => {
    form.value = {
        id: 0,
        tmName: '',
        logoUrl: ''
    }
    formRef.value.resetFields();
}


//上传图片前和成功后的钩子
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
    //要求:上传文件格式png|jpg|gif 4M
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true;
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件大小小于4M'
            })
            return false;
        }
    } else {
        ElMessage({
            type: 'error',
            message: "上传文件格式要求为PNG|JPG|GIF"
        })
        return false;
    }
}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    //response:即为当前这次上传图片post请求服务器返回的数据
    //收集上传图片的地址,添加一个新的品牌的时候带给服务器
    form.value.logoUrl = response.data;
    //图片上传成功, 清除掉对应图片校验结果
    formRef.value.clearValidate('logoUrl');
}

//表单校验规则对象
const rules = {
    tmName: [
        {
            required: true,
            message: '请输入品牌名称'
        },
        {
            trigger: 'blur',
            transform: (value) => value.trim(),
            min: 2,
            message: '品牌名称长度最少为2'
        }
    ],
    logoUrl: [
        {
            required: true,
            validator(rule, value, callback) {
                rule;
                value ? callback() : callback('请上传品牌LOGO')
            }
        }
    ]
}


</script>

<style scoped>
.el-table {
    margin: 10px 0;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>