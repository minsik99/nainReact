import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
import RadiusButton from '../../components/designTool/RadiusButton';
import noticeAxios from "../../api/noticeAxios";
import { useRouter } from 'next/router';
import styles from '../../styles/board/newBoard.module.css';


const NewBoard = () => {
    const router = useRouter();
    const { primalBoard } = router.query;
    const parsedBoard = primalBoard ? JSON.parse(primalBoard) : null;
    const [noticeTitle, setNoticeTitle] = useState(parsedBoard? parsedBoard.noticeTitle : '');
    const [noticeContent, setNoticeContent] = useState(parsedBoard? parsedBoard.noticeContent : ''); 
    const [uploadedFile, setUploadedFile] = useState(parsedBoard? parsedBoard.noticeFile : '');
    const [file, setFile] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const editorConfiguration = {
        language: 'ko',
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
          'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
          'undo', 'redo', '|',
          'insertImage',
        ],
      extraPlugins: [ MyCustomUploadAdapterPlugin ]
      };

      function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);
        };
      }

      class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }
        upload() {
            return this.loader.file.then(
                file =>
                    new Promise((resolve, reject) => {
                        const data = new FormData();
                        data.append('file', file);
    
                        fetch('http://localhost:9999/api/image/upload', {
                            method: 'POST',
                            body: data,
                        })
                            .then(response => response.json())
                            .then(result => {
                                resolve({
                                    default: result.url
                                });
                            })
                            .catch(error => {
                                reject(error);
                            });
                    })
              );
          }
      }

      const saveBoard = async () => {
        //글 수정
        if(primalBoard){

          const notice = {
            noticeNo: parsedBoard.noticeNo,
            noticeTitle: noticeTitle,
            noticeContent: noticeContent,
            noticeFile: file && file[0] ? file[0].name : null,
            noticeMFile: '',
            noticeDate: parsedBoard.noticeDate,
            noticeReadCount: parsedBoard.noticeReadCount,
          };
          console.log("수정하려는 게시판 정보", notice);
          if (file && file[0]) {
          try {
            
              const formData = new FormData();
              formData.append('file', file[0]);
        
              // 파일 업로드 비동기 처리
              const fileUploadResponse = await noticeAxios.insertFile(formData);
              notice.noticeMFile = fileUploadResponse.data;
              console.log("파일 저장명 : ", fileUploadResponse.data);
          } catch (error) {
            alert("파일 업로드 실패");
            console.error("파일 업로드 실패", error);
            return;
          }}
        
          // console.log(notice);
          // console.log(notice.noticeMFile);
        
          try {
            // 글 수정 비동기 처리
            const modifyNoticeResponse = await noticeAxios.modifyNotice(notice.noticeNo, notice);
            setShowModal(true); // 성공 모달 열기
            setTimeout(() => {
              setShowModal(false); // 모달 닫기
              router.push({
                pathname: '/notice/detail',
                query: {noticeNo:notice.noticeNo},
              });
            }, 500);
          } catch (error) {
            alert(`글 수정 실패: ${error.response.data.message}`);
            console.error("글 수정 실패", error);
          }
          
        //새 글 등록
        }else{
          const notice = {
          noticeTitle: noticeTitle,
          noticeContent: noticeContent,
          noticeFile: file[0] ? file[0].name : null,
          noticeMFile: '',
          };

        try {
          if (file[0]) {
            const formData = new FormData();
            formData.append('file', file[0]);
      
            // 파일 업로드 비동기 처리
            const fileUploadResponse = await noticeAxios.insertFile(formData);
            notice.noticeMFile = fileUploadResponse.data;
            console.log("파일 저장명 : ", fileUploadResponse.data);
          } else {
            notice.noticeMFile = uploadedFile;
          }
        } catch (error) {
          alert("파일 업로드 실패");
          console.error("파일 업로드 실패", error);
          return;
        }
      
        // console.log("notice : ", notice);
        // console.log(notice.noticeMFile);
      
        try {
          // 글 작성 비동기 처리
          const createNoticeResponse = await noticeAxios.createNotice(notice).then(res => {
            console.log('noticeNo', res.data);
            setShowModal(true); // 성공 모달 열기
            setTimeout(() => {
            setShowModal(false); // 모달 닫기
            router.push({
              pathname: '/notice/detail',
              query: {noticeNo: res.data},
            }); // 페이지 이동
          }, 500); // 
          })
        } catch (error) {
          alert(`글 등록 실패: ${error.response.data.message}`);
          console.error("글 등록 실패", error);
        }}
      };

      const downloadFile = () => {
        noticeAxios.getFile(parsedBoard.noticeMFile).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', board.noticeFile); // 다운로드 파일의 이름 설정
            document.body.appendChild(link);
            link.click();
        });
      };
      
      // const delFile =()=>{
      //   setUploadedFile(null);
      //   setFile(null);
      // };

      const reload = () => {
        router.push("/notice");
      };



      return (
        <div className={styles.base}>
              {primalBoard ? (
                  <h2>게시글 수정</h2>
              ) : (
                  <h2>게시글 작성</h2>
              )}
           
        <div className={styles.editor}>
              <input
              className={styles.title}
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              />
            <CKEditor
            className={styles.ckeditor}
              editor={ClassicEditor}
              config={editorConfiguration}
              data={noticeContent}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log(data);
                setNoticeContent(data);
              }}
            />
              {uploadedFile && (
                <div className={styles.file}>첨부 파일 : <a className={styles.file} onClick={downloadFile}>{uploadedFile}</a>
                  &nbsp; <img className={styles.delete} src="../../../image/pngegg11.png" onClick={delFile}></img>
                  <h6>※ 파일 업로드는 1개만, 최대 50MB까지 가능합니다.</h6>
                </div>
              )}
              <input 
              className={styles.inputFile}
              type="file"
              onChange={(e) => setFile(e.target.files)}/>
          </div>
          <div className={styles.buttons}>
            <RadiusButton color="#77AAAD" text="목록" onClick={reload}/>
            <RadiusButton color="#77AAAD" text="등록" onClick={saveBoard}/>
          </div>
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