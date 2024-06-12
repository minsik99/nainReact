import React, { useState } from 'react';

const MyResumeInsert = () => {
    const [resume, setResume] = useState({
        title: '',
        name: '',
        email: '',
        phone: '',
        introduction: '',
        experiences: [{ id: Date.now(), company: '', position: '', startDate: '', endDate: '', achievements: '' }],
        education: [{ id: Date.now(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false }],
        skills: ['JavaScript', 'Git'],
        awards: [{ id: Date.now(), title: '', description: '', startDate: '', endDate: ''}]
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const valueToUse = type === 'checkbox' ? checked : value;
        setResume({ ...resume, [name]: valueToUse });
    };

    const handleExperienceChange = (id, e) => {
        const { name, value } = e.target;
        const newExperiences = resume.experiences.map(exp =>
            exp.id === id ? { ...exp, [name]: value } : exp
        );
        setResume({ ...resume, experiences: newExperiences });
    };

    const addExperience = () => {
        setResume({
            ...resume,
            experiences: [...resume.experiences, { id: Date.now(), company: '', position: '', startDate: '', endDate: '', achievements: '' }]
        });
    };

    const removeExperience = (id) => {
        const newExperiences = resume.experiences.filter(exp => exp.id !== id);
        setResume({ ...resume, experiences: newExperiences });
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
            education: [...resume.education, { id: Date.now(), school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false }]
        });
    };

    const removeEducation = (id) => {
        const newEducation = resume.education.filter(edu => edu.id !== id);
        setResume({ ...resume, education: newEducation });
    };

    const handleSkillChange = (e) => {
        setResume({ ...resume, skills: e.target.value.split(',') });
    };

    const handleAwardChange = (id, e) => {
        const { name, value } = e.target;
        const newAwards = resume.awards.map(award =>
            award.id === id ? { ...award, [name]: value } : award
        );
        setResume({ ...resume, awards: newAwards });
    };

    const addAward = () => {
        setResume({
            ...resume,
            awards: [...resume.awards, { id: Date.now(), title: '', description: '', startDate: '', endDate: '' }]
        });
    };

    const removeAward = (id) => {
        const newAwards = resume.awards.filter(award => award.id !== id);
        setResume({ ...resume, awards: newAwards });
    };

    const saveResume = (isTemporary) => {
        // Implement save functionality here
        console.log('Resume saved', resume);
        if (!isTemporary) {
            // Redirect to list page if not temporary save
            window.location.href = '/resume-list';
        }
    };

    return (
        <div className="resume-container">
            <h1>이력서 작성하기</h1>
            <form>
                <div>
                    <label>이력서 제목</label>
                    <input type="text" name="title" value={resume.title} onChange={handleChange} />
                </div>

                <label>기본 정보</label>
                <div>
                    이름 <input type="text" name="name" value={resume.name} onChange={handleChange} />
                    이메일 <input type="email" name="email" value={resume.email} onChange={handleChange} />
                    전화번호 <input type="tel" name="phone" value={resume.phone} onChange={handleChange} />
                </div>
                <div>
                    
                </div>
                <div>
                    
                </div>
                <div>
                    <label>간단 소개글</label>
                    <textarea name="introduction" value={resume.introduction} onChange={handleChange}></textarea>
                </div>
                &nbsp;

                <div>
                    <label>경력</label>
                    <button type="button" className="add-button" onClick={addExperience}>추가</button>
                    {resume.experiences.map(exp => (
                        <div key={exp.id} className="experience">
                            <button type="button" className="remove-button" onClick={() => removeExperience(exp.id)}>x</button>
                            <p>경력 세부사항</p>
                            <input type="text" name="company" placeholder="회사명" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="text" name="position" placeholder="부서/직책" value={exp.position} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, e)} />
                            <textarea name="achievements" placeholder="주요 성과" value={exp.achievements} onChange={(e) => handleExperienceChange(exp.id, e)}></textarea>
                        </div>
                    ))}
                </div>
                &nbsp;

                <div>
                    <label>학력</label>
                    <button type="button" className="add-button" onClick={addEducation}>추가</button>
                    {resume.education.map(edu => (
                        <div key={edu.id} className="education">
                            <button type="button" className="remove-button" onClick={() => removeEducation(edu.id)}>x</button>
                            현재 재학중 <input type="checkbox" className="checkbox" checked={edu.current} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="text" name="school" placeholder="학교명" value={edu.school} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="text" name="degree" placeholder="전공 및 학위" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="text" name="fieldOfStudy" placeholder="이수과목 또는 연구내용" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={edu.startDate} onChange={(e) => handleEducationChange(edu.id, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={edu.endDate} onChange={(e) => handleEducationChange(edu.id, e)} />

                        </div>
                    ))}
                </div>
                &nbsp;

                <div>
                    <label>스킬</label>
                    <input type="text" name="skills" value={resume.skills.join(', ')} onChange={handleSkillChange} placeholder="보유 스킬을 입력하세요. (콤마로 구분)" />
                </div>
                &nbsp;

                <div>
                    <label>수상 및 기타</label>
                    <button type="button" className="add-button" onClick={addAward}>추가</button>
                    {resume.awards.map(award => (
                        <div key={award.id} className="award">
                            <button type="button" className="remove-button" onClick={() => removeAward(award.id)}>x</button>
                            <p>수상 및 기타 세부사항</p>
                            <input type="text" name="title" placeholder="활동명" value={award.title} onChange={(e) => handleAwardChange(award.id, e)} />
                            <textarea name="description" placeholder="활동 세부 내용" value={award.description} onChange={(e) => handleAwardChange(award.id, e)}></textarea>
                            <input type="month" name="startDate" placeholder="YYYY.MM" value={award.startDate} onChange={(e) => handleAwardChange(award.id, e)} />
                            <input type="month" name="endDate" placeholder="YYYY.MM" value={award.endDate} onChange={(e) => handleAwardChange(award.id, e)} />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => saveResume(true)}>임시 저장</button>
                <button type="button" onClick={() => saveResume(false)}>저장하기</button>
            </form>
        </div>
    );
};

export default MyResumeInsert;
