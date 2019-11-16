import React from 'react'
import { Upload, Icon, Modal ,message } from 'antd';
import {BASE_IMG_URL} from '../../utils/constants'
import {reqDelImg} from '../../api'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,// 标识是否显示大图预览Modal
            previewImage: '',// 大图的url
            fileList: [
                // {
                //     uid: '-1',
                //     name: 'image.png',
                //     status: 'done',// 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                // },
            ],
        }
    }
    static getDerivedStateFromProps (props, state) {
        const propsHasImg = props.imgs && props.imgs.length > 0
        const stateNotImg = state.fileList.length == 0
        //state上fileLis没有值 并且props上的fileList有值(save组件传过来的)
        let fileList;
        if (propsHasImg && stateNotImg) {
            fileList = props.imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id
                name: img, // 图片文件名
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url: BASE_IMG_URL + img
            }))
            return {
                fileList
            }
        }
        return null
    }

    /*
    隐藏Modal
     */
    handleCancel = () => this.setState({ previewVisible: false });
    //预览大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    }

    /*
        获取所有已上传图片文件名的数组
    */
    getImgs  = () => {
        return this.state.fileList.map(file => file.name)
    }

    /*
    file: 当前操作的图片文件(上传/删除)
    fileList: 所有已上传图片文件对象的数组
    */
    handleChange = async ({file, fileList}) => {
        console.log(fileList, file);
        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if(file.status==='done') {
            const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if(result.status===0) {
                message.success('上传图片成功!')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status==='removed') { // 删除图片
            const result = await reqDelImg(file.name)
            if (result.status===0) {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }

        // 在操作(上传/删除)过程中更新fileList状态
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" /*上传图片的接口地址*/
                    accept='image/*'  /*只接收图片格式*/
                    name='image' /*请求参数名*/
                    listType="picture-card"  /*卡片样式*/
                    fileList={fileList}  /*所有已上传图片文件对象的数组*/
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default PicturesWall;