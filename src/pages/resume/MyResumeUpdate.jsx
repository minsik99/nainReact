import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const MyResumeUpdate = () => {
    const router = useRouter();
    const { resumeNo } = router.query;
    const [resume, setResume] = useState({
        title: '',
        resumeName: '',
        email: '',
        phone: '',
        introduction: '',
        jobCategory: ''
    });
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (resumeNo) {
            axios.get(`http://localhost:9999/resume/${resumeNo}`)
                .then(response => {
                    setResume(response.data);
                })
                .catch(error => {
                    console.error('Error fetching resume:', error);
                });

            axios.get(`http://localhost:9999/experience/resume/${resumeNo}`)
                .then(response => {
                    setExperience(response.data);
                })
                .catch(error => {
                    console.error('Error fetching experiences:', error);
                });

            axios.get(`http://localhost:9999/education/resume/${resumeNo}`)
                .then(response => {
                    setEducation(response.data);
                })
                .catch(error => {
                    console.error('Error fetching education:', error);
                });

            axios.get(`http://localhost:9999/activity/resume/${resumeNo}`)
                .then(response => {
                    setActivity(response.data);
                })
                .catch(error => {
                    console.error('Error fetching activities:', error);
                })
                .finally(() => setLoading(false));
        }
    }, [resumeNo]);

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
        const { name, value } = e.target;
        const newExperience = experience.map(exp => {
            const updatedExp = { ...exp, [name]: value };
            if (name === 'startDate' || name === 'endDate') {
                updatedExp.exDuration = calculateDuration(updatedExp.startDate, updatedExp.endDate);
            }
            return updatedExp;
        });
        setExperience(newExperience);
    };

    const addExperience = () => {
        setExperience([...experience, { experienceNo: Date.now(), company: '', department: '', exPosition: '', startDate: '', endDate: '', responsibilities: '', current: false, exDuration: '' }]);
    };

    const removeExperience = (id) => {
        const newExperience = experience.filter(exp => exp.experienceNo !== id);
        setExperience(newExperience);
    };

    const handleEducationChange = (id, e) => {
        const { name, value, checked, type } = e.target;
        const valueToUse = type === 'checkbox' ? checked : value;
        const newEducation = education.map(edu => edu.educationNo === id ? { ...edu, [name]: valueToUse } : edu);
        setEducation(newEducation);
    };

    const addEducation = () => {
        setEducation([...education, { educationNo: Date.now(), schoolName: '', major: '', degree: '', score: '', startDate: '', endDate: '', current: false }]);
    };

    const removeEducation = (id) => {
        const newEducation = education.filter(edu => edu.educationNo !== id);
        setEducation(newEducation);
    };

    const handleActivityChange = (id, e) => {
        const { name, value } = e.target;
        const newActivity = activity.map(act => act.activityNo === id ? { ...act, [name]: value } : act);
        setActivity(newActivity);
    };

    const addActivity = () => {
        setActivity([...activity, { activityNo: Date.now(), activityName: '', organizer: '', activityDescription: '', startDate: '', endDate: '' }]);
    };

    const removeActivity = (id) => {
        const newActivity = activity.filter(act => act.activityNo !== id);
        setActivity(newActivity);
    };

    const updateResume = async () => {
        const modifiedResume = {
            ...resume,
            experiences: experience.map(exp => ({ ...exp, current: exp.current ? 'Y' : 'N' })),
            education: education.map(edu => ({ ...edu, current: edu.current ? 'Y' : 'N' })),
            activities: activity.map(act => ({ ...act }))
        };

        try {
            const resumeResponse = await axios.put(`http://localhost:9999/resume/${resumeNo}`, modifiedResume);

            const experiencePromises = modifiedResume.experiences.map(exp => {
                if (exp.experienceNo.toString().length > 10) { // 새로운 항목
                    return axios.post(`http://localhost:9999/experience/resume/${resumeNo}/create`, exp);
                } else { // 기존 항목
                    return axios.put(`http://localhost:9999/experience/${exp.experienceNo}`, exp);
                }
            });

            const educationPromises = modifiedResume.education.map(edu => {
                if (edu.educationNo.toString().length > 10) { // 새로운 항목
                    return axios.post(`http://localhost:9999/education/resume/${resumeNo}/create`, edu);
                } else { // 기존 항목
                    return axios.put(`http://localhost:9999/education/${edu.educationNo}`, edu);
                }
            });

            const activityPromises = modifiedResume.activities.map(act => {
                if (act.activityNo.toString().length > 10) { // 새로운 항목
                    return axios.post(`http://localhost:9999/activity/resume/${resumeNo}/create`, act);
                } else { // 기존 항목
                    return axios.put(`http://localhost:9999/activity/${act.activityNo}`, act);
                }
            });

            await Promise.all([...experiencePromises, ...educationPromises, ...activityPromises]);
            router.push('/resume/MyResume');
        } catch (error) {
            console.error('Error updating resume:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="resume-container">
            <h1>이력서 상세보기 / 수정하기</h1>
            <form>
                <div>
                    <label>이력서 제목</label>
                    <input type="text" name="title" value={resume.title} onChange={handleChange} />
                </div>
                &nbsp;

                <div>
                    <label>직무 카테고리</label>
                    <select name="jobCategory" value={resume.jobCategory} onChange={handleChange}>
                        <option value="">직무 카테고리를 선택하세요</option>
                        <option value="웹 개발자">웹 개발자</option>
                        <option value="프론트엔드 개발자">프론트엔드 개발자</option>
                        <option value="서버 개발자">서버 개발자</option>
                        <option value="자바 개발자">자바 개발자</option>
                        <option value="파이썬 개발자">파이썬 개발자</option>
                    </select>
                </div>
                &nbsp;

                <label>기본 정보</label>
                <div>
                    이름 <input type="text" name="resumeName" value={resume.resumeName} onChange={handleChange} />
                    이메일 <input type="email" name="email" value={resume.email} onChange={handleChange} />
                    전화번호 <input type="tel" name="phone" value={resume.phone} onChange={handleChange} />
                </div>
                &nbsp;

                <div>
                    <label>자기 소개서</label>
                    <textarea name="introduction" value={resume.introduction} onChange={handleChange}></textarea>
                </div>
                &nbsp;

                <div>
                    <label>경력</label>
                    <button type="button" className="add-button" onClick={addExperience}>추가</button>
                    {experience.map(exp => (
                        <div key={exp.experienceNo} className="experience">
                            <button type="button" className="remove-button" onClick={() => removeExperience(exp.experienceNo)}>x</button>
                            <p>경력 세부사항</p>
                            현재 근무중 <input type="checkbox" className="checkbox" checked={exp.current} onChange={(e) => handleExperienceChange(exp.experienceNo, e)} />
                            <input type="text" name="company" placeholder="회사명" value={exp.company} onChange={(e) => handleExperienceChange(exp.experienceNo, e)} />
                            <input type="text" name="department" placeholder="부서명" value={exp.department} onChange={(e) => handleExperienceChange(exp.experienceNo, e)} />
                            <input type="text" name="exPosition" placeholder="직책" value={exp.exPosition} onChange={(e) => handleExperienceChange(exp.experienceNo, e)} />
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.experienceNo, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.experienceNo, e)} />
                            <textarea name="responsibilities" placeholder="담당 업무 및 주요 성과" value={exp.responsibilities} onChange={(e) => handleExperienceChange(exp.experienceNo, e)}></textarea>
                            <input type="text" name="exDuration" placeholder="근무기간(개월)" value={exp.exDuration} readOnly />
                        </div>
                    ))}
                </div>
                &nbsp;

                <div>
                    <label>학력</label>
                    <button type="button" className="add-button" onClick={addEducation}>추가</button>
                    {education.map(edu => (
                        <div key={edu.educationNo} className="education">
                            <button type="button" className="remove-button" onClick={() => removeEducation(edu.educationNo)}>x</button>
                            <p>학력 세부사항</p>
                            현재 재학중 <input type="checkbox" className="checkbox" checked={edu.current} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                            <input type="text" name="schoolName" placeholder="학교명" value={edu.schoolName} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                            <input type="text" name="major" placeholder="전공" value={edu.major} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                            <input type="text" name="degree" placeholder="학위 (학사/석사/박사)" value={edu.degree} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                            <input type="number" step="0.01" name="score" placeholder="학점 (4.5 만점 기준)" value={edu.score} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={edu.startDate} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={edu.endDate} onChange={(e) => handleEducationChange(edu.educationNo, e)} />
                        </div>
                    ))}
                </div>
                &nbsp;

                <div>
                    <label>활동 및 기타</label>
                    <button type="button" className="add-button" onClick={addActivity}>추가</button>
                    {activity.map(act => (
                        <div key={act.activityNo} className="activity">
                            <button type="button" className="remove-button" onClick={() => removeActivity(act.activityNo)}>x</button>
                            <p>활동 및 기타 세부사항</p>
                            <input type="text" name="activityName" placeholder="활동명 및 기타명" value={act.activityName} onChange={(e) => handleActivityChange(act.activityNo, e)} />
                            <input type="text" name="organizer" placeholder="주최기관" value={act.organizer} onChange={(e) => handleActivityChange(act.activityNo, e)} />
                            <textarea name="activityDescription" placeholder="세부 내용" value={act.activityDescription} onChange={(e) => handleActivityChange(act.activityNo, e)}></textarea>
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={act.startDate} onChange={(e) => handleActivityChange(act.activityNo, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={act.endDate} onChange={(e) => handleActivityChange(act.activityNo, e)} />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={updateResume}>저장하기</button>
            </form>
        </div>
    );
};

export default MyResumeUpdate;
