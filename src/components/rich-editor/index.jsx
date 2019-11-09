import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw ,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class EditorConvertToHTML extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isBackfill:false,
            editorState: EditorState.createEmpty(),
        }
    }

    static propTypes = {
        detail: PropTypes.string
    }
    //不能在static getDerivedStateFromProps函数中回填props中数据
    //原因要用到this.simditor 在静态生命周期函数中拿不到this
    //所以在componentDidUpdate函数中回填images数据
    componentDidUpdate() {
        const html = this.props.detail;
        if (html && !this.state.isBackfill) {
            this.setState(()=>({isBackfill:true}))
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                isBackfill:true,
                editorState
            })
        }

    }


    onEditorStateChange = (editorState) => {
        this.setState({
            isBackfill:true,
            editorState,
        });
    }

    getDetail = () => {
        // 返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallBack = (file) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');
            // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                const url = response.data.url // 得到图片的url
                resolve({data: {link: url}})
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorStyle={{border: '1px solid #ccc', minHeight: 200, paddingLeft: 10}}
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        );
    }
}