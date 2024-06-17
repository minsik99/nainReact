import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
import RadiusButton from '../../components/designTool/RadiusButton';
import CommunityAxios from "../../api/CommunityAxios";
import { useRouter } from 'next/router';


const NewBoard = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); 
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    
    const editorConfiguration = {
        language: 'ko',
        ckfinder: {
          uploadUrl: '/upload' // 서버의 이미지 업로드 엔드포인트 설정
        },
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
          'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
          'undo', 'redo', '|',
          'imageUpload' // 이미지 업로드 버튼 추가
        ]
      };

    const saveBoard =()=> {
        const community = {
            title: title,
            content: content.replace(/<p>/g, '').replace(/<\/p>/g, ''),
        };
        console.log(community);
        try {
          CommunityAxios.createCommunity(community);
          setShowModal(true); // 성공 모달 열기
          setTimeout(() => {
              setShowModal(false); // 모달 닫기
              router.push('/community');
          }, 2000); // 2초 후에 페이지 이동
          
        }catch(error){
          console.error("글 등록 실패")
        };
    };
    
      return (
        <div>
          <h2>게시글 작성</h2>
          <div>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
            />
        </div>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data="내용을 입력하세요."
              onReady={editor => {
              console.log('Editor is ready to use!', editor);
              }}
              onChange={(event, editor) => {
              const data = editor.getData();
              console.log(data);
              setContent(data);
              }}
              onBlur={(event, editor) => {
              console.log('Blur.', editor);
              }}
              onFocus={(event, editor) => {
              console.log('Focus.', editor);
              }}
           />
          <RadiusButton className="btn btn-primary" text="등록" onClick={saveBoard}/>
          {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>등록 완료</h3>
                    </div>
                </div>
            )}
        </div>
      );
    };

export default NewBoard;