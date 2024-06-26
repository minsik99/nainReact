import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../styles/resume/MyResumeInsert.module.css';

const MyResumeInsert = () => {
    const router = useRouter();
    const [resume, setResume] = useState({
        title: '',
        resumeName: '',
        email: '',
        phone: '',
        introduction: '',
        jobCategory: '',
        experience: [{ id: Date.now(), company: '', department: '', exPosition: '', startDate: '', endDate: '', responsibilities: '', current: false, exDuration: '' }],
        education: [{ id: Date.now(), schoolName: '', major: '', degree: '', score: '', startDate: '', endDate: '', current: false }],
        activity: [{ id: Date.now(), activityName: '', organizer: '', activityDescription: '', startDate: '', endDate: '' }]
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const valueToUse = type === 'checkbox' ? checked : value;
        setResume({ ...resume, [name]: valueToUse });
    };

    // 근무 기간 계산
    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return durationInMonths;
    };

    const handleExperienceChange = (id, e) => {
        const { name, value, checked, type } = e.target;
        const valueToUse = type === 'checkbox' ? checked : value;
        const newExperience = resume.experience.map(exp => {
            if (exp.id === id) {
                const updatedExp = { ...exp, [name]: valueToUse };
                if (name === 'startDate' || name === 'endDate') {
                    updatedExp.exDuration = calculateDuration(updatedExp.startDate, updatedExp.endDate);
                }
                return updatedExp;
            }
            return exp;
        });
        setResume({ ...resume, experience: newExperience });
    };

    const addExperience = () => {
        setResume({
            ...resume,
            experience: [...resume.experience, { id: Date.now(), company: '', department: '', exPosition: '', startDate: '', endDate: '', responsibilities: '', current: false, exDuration: '' }]
        });
    };

    const removeExperience = (id) => {
        const newExperience = resume.experience.filter(exp => exp.id !== id);
        setResume({ ...resume, experience: newExperience });
    };

    const handleEducationChange = (id, e) => {
        const { name, value, checked, type } = e.target;
        const valueToUse = type === 'checkbox' ? checked : value;
        const newEducation = resume.education.map(edu =>
            edu.id === id ? { ...edu, [name]: valueToUse } : edu
        );
        setResume({ ...resume, education: newEducation });
    };

    const addEducation = () => {
        setResume({
            ...resume,
            education: [...resume.education, { id: Date.now(), schoolName: '', major: '', degree: '', score: '', startDate: '', endDate: '', current: false }]
        });
    };

    const removeEducation = (id) => {
        const newEducation = resume.education.filter(edu => edu.id !== id);
        setResume({ ...resume, education: newEducation });
    };

    const handleactChange = (id, e) => {
        const { name, value } = e.target;
        const newActivity = resume.activity.map(act =>
            act.id === id ? { ...act, [name]: value } : act
        );
        setResume({ ...resume, activity: newActivity });
    };

    const addActivity = () => {
        setResume({
            ...resume,
            activity: [...resume.activity, { id: Date.now(), activityName: '', organizer: '', activityDescription: '', startDate: '', endDate: '' }]
        });
    };

    const removeActivity = (id) => {
        const newActivity = resume.activity.filter(act => act.id !== id);
        setResume({ ...resume, activity: newActivity });
    };

    // 유효성 체크
    const validateResume = () => {
        if (!resume.title) return '이력서 제목을 입력하세요.';
        if (!resume.resumeName) return '이름을 입력하세요.';
        if (!resume.email) return '이메일을 입력하세요.';
        if (!resume.phone) return '전화번호를 입력하세요.';
        if (!resume.introduction) return '자기 소개서를 입력하세요.';
        if (!resume.jobCategory) return '직무 카테고리를 선택하세요.';
        for (let exp of resume.experience) {
            if (!exp.company || !exp.department || !exp.exPosition || !exp.startDate || !exp.endDate || !exp.responsibilities) {
                return '모든 경력 사항을 입력하세요.';
            }
        }
        for (let edu of resume.education) {
            if (!edu.schoolName || !edu.major || !edu.degree || !edu.startDate || !edu.endDate || !edu.score) {
                return '모든 학력 사항을 입력하세요.';
            }
        }
        for (let act of resume.activity) {
            if (!act.activityName || !act.organizer || !act.activityDescription || !act.startDate || !act.endDate) {
                return '모든 활동 사항을 입력하세요.';
            }
        }
        return null;
    };

    // resume 저장
    const saveResume = async () => {
        // 유효성 체크 안내
        const errorMessage = validateResume();
        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        try {
            // resume 객체 복사
            const modifiedResume = {
                ...resume,
                experience: resume.experience.map(exp => ({
                    ...exp,
                    current: exp.current ? 'Y' : 'N'
                })),
                education: resume.education.map(edu => ({
                    ...edu,
                    current: edu.current ? 'Y' : 'N'
                })),
                activity: resume.activity.map(act => ({
                    ...act
                }))
            };

            // JWT 토큰 가져오기
            const token = localStorage.getItem('token'); // 실제 유효한 토큰으로 교체
            if (!token) {
                throw new Error('No token found');
            }

            // resume 저장 요청
            const response = await axios.post('http://localhost:9999/resume/create', modifiedResume, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const resumeNo = response.data.resumeNo;

            // 응답 받은 resumeNo로, 경력 저장 요청
            const experiencePromises = modifiedResume.experience.map(exp => {
                return axios.post(`http://localhost:9999/experience/resume/${resumeNo}/create`, exp, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            });

            // 응답 받은 resumeNo로, 학력 저장 요청
            const educationPromises = modifiedResume.education.map(edu => {
                return axios.post(`http://localhost:9999/education/resume/${resumeNo}/create`, edu, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            });

            // 응답 받은 resumeNo로, 활동 저장 요청
            const activityPromises = modifiedResume.activity.map(act => {
                return axios.post(`http://localhost:9999/activity/resume/${resumeNo}/create`, act, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            });

            // 모든 저장 요청이 완료될 때 까지 대기
            await Promise.all([...experiencePromises, ...educationPromises, ...activityPromises]);

            // 저장 버튼 클릭하여 모든 요청 완료 후 목록 페이지로 이동
            router.push('/resume');
        } catch (error) {
            console.error('Error saving resume:', error);
        }
    };

    return (
        <div className={styles.resumeContainer}>
            <h1>이력서 작성하기</h1>
            <form>
                <div>
                    <label>직무 카테고리</label><p />
                    <select name="jobCategory" value={resume.jobCategory} className={styles.jobCateory} onChange={handleChange}>
                        <option value="">직무 카테고리를 선택하세요</option>
                        <option value="웹 개발자">웹 개발자</option>
                        <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                        <option value="서버 개발자">서버 개발자</option>
                        <option value="서비스 기획자">서비스 기획자</option>
                        <option value="PM/PO">PM/PO</option>
                    </select>
                </div>
                &nbsp;
                <div>
                    <label>이력서 제목</label>
                    <input type="text" name="title" value={resume.title} onChange={handleChange} />
                </div>


                <label>기본 정보</label>
                <div className={styles.resumebasic}>
                    <div className={styles.inputGroup}>
                        <p>이름</p>
                        <input type="text" name="resumeName" value={resume.resumeName} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <p>이메일</p>
                        <input type="email" name="email" value={resume.email} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <p>전화번호</p>
                        <input type="tel" name="phone" value={resume.phone} onChange={handleChange} />
                    </div>
                </div>
                &nbsp;

                <div>
                    <label>자기 소개서</label>
                    <textarea name="introduction" value={resume.introduction} onChange={handleChange}></textarea>
                </div>
                &nbsp;

                <div>
                    <label>경력</label>
                    <button type="button" className={styles.addButton} onClick={addExperience}>
                        <img src="/image/MyResumeInsertPlus.png" alt="추가" className={styles.addButtonImage} />
                    </button>

                    {resume.experience.map(exp => (
                        <div key={exp.id} className={styles.experience}>
                            <div className={styles.header}>
                                <span>경력 세부사항</span>
                                <button type="button" className={styles.removeButton} onClick={() => removeExperience(exp.id)}>
                                    <img src="/image/MyResumeInsertDelete.png" alt="삭제" className={styles.removeButtonImage} />
                                </button>
                            </div>
                            <div className={styles.checkbox}>
                                <span>현재 근무중</span>
                                <input
                                    type="checkbox"
                                    name="current"
                                    checked={exp.current}
                                    onChange={(e) => handleExperienceChange(exp.id, e)}
                                />
                            </div>
                            <input type="text" name="company" placeholder="회사명" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="text" name="department" placeholder="부서명" value={exp.department} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="text" name="exPosition" placeholder="직책" value={exp.exPosition} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <textarea name="responsibilities" placeholder="담당 업무 및 주요 성과" value={exp.responsibilities} onChange={(e) => handleExperienceChange(exp.id, e)}></textarea>
                            <input type="text" name="exDuration" placeholder="근무기간(개월)" value={exp.exDuration} readOnly />
                        </div>
                    ))}
                </div>
                &nbsp;

                <div>
                    <label>학력</label>
                    <button type="button" className={styles.addButton} onClick={addEducation}>
                        <img src="/image/MyResumeInsertPlus.png" alt="추가" className={styles.addButtonImage} />
                    </button>
                    {resume.education.map(edu => (
                        <div key={edu.id} className={styles.education}>
                            <div className={styles.header}>
                                <span>학력 세부사항</span>
                                <button type="button" className={styles.removeButton} onClick={() => removeEducation(edu.id)}>
                                    <img src="/image/MyResumeInsertDelete.png" alt="삭제" className={styles.removeButtonImage} />
                                </button>
                            </div>
                            <div className={styles.checkbox}>
                                <span>현재 재학중</span>
                                <input
                                    type="checkbox"
                                    name="current"
                                    checked={edu.current}
                                    onChange={(e) => handleEducationChange(edu.id, e)}
                                />
                            </div>
                            <input type="text" name="schoolName" placeholder="학교명" value={edu.schoolName} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="text" name="major" placeholder="전공" value={edu.major} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="text" name="degree" placeholder="학위 (학사/석사/박사)" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="number" step="0.01" name="score" placeholder="학점 (4.5 만점 기준)" value={edu.score} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={edu.startDate} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={edu.endDate} onChange={(e) => handleEducationChange(edu.id, e)} />
                        </div>
                    ))}
                </div>
                &nbsp;

                <div>
                    <label>활동 및 기타</label>
                    <button type="button" className={styles.addButton} onClick={addActivity}>
                        <img src="/image/MyResumeInsertPlus.png" alt="추가" className={styles.addButtonImage} />
                    </button>
                    {resume.activity.map(act => (
                        <div key={act.id} className={styles.activity}>
                            <div className={styles.header}>
                                <span>활동 및 기타 세부사항</span>
                                <button type="button" className={styles.removeButton} onClick={() => removeActivity(act.id)}>
                                    <img src="/image/MyResumeInsertDelete.png" alt="삭제" className={styles.removeButtonImage} />
                                </button>
                            </div>
                            <input type="text" name="activityName" placeholder="활동명 및 기타명" value={act.activityName} onChange={(e) => handleactChange(act.id, e)} />
                            <input type="text" name="organizer" placeholder="주최기관" value={act.organizer} onChange={(e) => handleactChange(act.id, e)} />
                            <textarea name="activityDescription" placeholder="세부 내용" value={act.activityDescription} onChange={(e) => handleactChange(act.id, e)}></textarea>
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={act.startDate} onChange={(e) => handleactChange(act.id, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={act.endDate} onChange={(e) => handleactChange(act.id, e)} />
                        </div>
                    ))}
                </div>
                <button type="button" className={styles.saveButton} onClick={saveResume}>저장하기</button>
            </form>
        </div>
    );
};

export default MyResumeInsert;
