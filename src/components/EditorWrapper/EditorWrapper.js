import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// takes html and updateContent props

export default class EditorWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.onEditorStateChange = onEditorStateChange.bind(this);
		function onEditorStateChange(editorState) {
			if (this.props.updateContent) {
				this.props.updateContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
			}
			this.setState({
				editorState,
			});
		}
	}
	componentWillMount() {
		const html = this.props.html ? this.props.html : '<p></p>';
		const contentBlock = htmlToDraft(html);
		const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
		const editorState = EditorState.createWithContent(contentState);
		this.state.editorState = editorState;
	}

	render() {
		return (
			<div>
				<Editor
					editorState={this.state.editorState}
					wrapperClassName='note-editor-wrapper'
					editorClassName='note-editor'
					onEditorStateChange={this.onEditorStateChange}
					toolbar={{
						options: ['inline', 'fontSize', 'list', 'textAlign', 'history'],
					}}
				/>
			</div>
		);
	}
}
