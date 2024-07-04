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
    const [noticeTitle, setNoticeTitle] = useState(parsedBoard ? parsedBoard.noticeTitle : '');
    const [noticeContent, setNoticeContent] = useState(parsedBoard ? parsedBoard.noticeContent : ''); 
    const [uploadedFile, setUploadedFile] = useState(parsedBoard ? parsedBoard.fileName : '');
    const [noticeImportent, setNoticeImportent] = useState(parsedBoard ? parsedBoard.noticeImportent : '');
    const [file, setFile] = useState([]);
    const [showModal, setShowModal] = useState(false);

    //날짜가 이전 날짜인 경우 null처리
    useEffect(() => {
        if (noticeImportent && new Date() > new Date(noticeImportent)) {
            setNoticeImportent(null);
        }
    }, [noticeImportent]);

    const editorConfiguration = {
        language: 'ko',
        toolbar: [
            'heading', '|',
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
            'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
            'undo', 'redo', '|',
            'insertImage',
        ],
        extraPlugins: [MyCustomUploadAdapterPlugin]
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
        const notice = {
            noticeTitle,
            noticeContent,
            noticeFile: file[0] ? file[0].name : null,
            noticeMFile: '',
            noticeImportent
        };

        if (parsedBoard) {
            // 기존 공지를 수정하는 경우
            notice.noticeNo = parsedBoard.noticeNo;
            notice.noticeDate = parsedBoard.noticeDate;
            notice.noticeReadCount = parsedBoard.noticeReadCount;

            if (file && file[0]) {
                try {
                    const formData = new FormData();
                    formData.append('file', file[0]);
                    const fileUploadResponse = await noticeAxios.insertFile(formData);
                    notice.noticeMFile = fileUploadResponse.data;
                } catch (error) {
                    alert("파일 업로드 실패");
                    console.error("파일 업로드 실패", error);
                    return;
                }
            }

            try {
                await noticeAxios.modifyNotice(notice.noticeNo, notice);
                showModalWithTimeout(() => router.push(`/notice/detail?noticeNo=${notice.noticeNo}`));
            } catch (error) {
                alert(`글 수정 실패: ${error.response.data.message}`);
                console.error("글 수정 실패", error);
            }
        } else {
            // 새 공지를 작성하는 경우
            if (file[0]) {
                try {
                    const formData = new FormData();
                    formData.append('file', file[0]);
                    const fileUploadResponse = await noticeAxios.insertFile(formData);
                    notice.noticeMFile = fileUploadResponse.data;
                } catch (error) {
                    alert("파일 업로드 실패");
                    console.error("파일 업로드 실패", error);
                    return;
                }
            } else {
                notice.noticeMFile = uploadedFile;
            }

            try {
                const createNoticeResponse = await noticeAxios.createNotice(notice);
                showModalWithTimeout(() => router.push(`/notice/detail?noticeNo=${createNoticeResponse.data}`));
            } catch (error) {
                alert(`글 등록 실패: ${error.response.data.message}`);
                console.error("글 등록 실패", error);
            }
        }
    };

    const downloadFile = () => {
        noticeAxios.getFile(parsedBoard.noticeMFile).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', board.fileName); // 다운로드되는 파일의 이름 설정
            document.body.appendChild(link);
            link.click();
        });
    };

    const reload = () => {
        router.push("/notice");
    };

    const delFile =()=>{
      setUploadedFile(null);
      setFile(null);
    };

    const showModalWithTimeout = (callback) => {
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
            callback();
        }, 500);
    };

    return (
        <div className={styles.base}>
            <h2>{primalBoard ? '게시글 수정' : '게시글 작성'}</h2>
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
                    onChange={(event, editor) => setNoticeContent(editor.getData())}
                />
                {uploadedFile && (
                  <div className={styles.fileName}>첨부 파일 : <a className={styles.file} onClick={downloadFile}>{uploadedFile}</a>
                  &nbsp; <img className={styles.delete} src="../../../image/pngegg11.png" onClick={delFile}></img>
                  <h6>※ 파일 업로드는 1개만, 최대 50MB까지 가능합니다.</h6>
                </div>
                )}
                <input 
                    className={styles.inputFile}
                    type="file"
                    onChange={(e) => setFile(e.target.files)}
                />
                <label className={styles.importanceLabel} htmlFor="importance">중요도: </label>
                <input
                    id="importance"
                    className={styles.importanceInput}
                    type="date"
                    value={noticeImportent || ''}
                    onChange={(e) => setNoticeImportent(e.target.value)}
                />
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