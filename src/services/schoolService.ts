import { collection, doc, getDocs, setDoc, query, where, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Class, Section } from '../types';

export const setupInitialSchoolStructure = async () => {
  const classes = [
    { id: 'lkg', name: 'LKG', grade: -2, sections: 1 },
    { id: 'ukg', name: 'UKG', grade: -1, sections: 1 },
    { id: '1', name: 'Class 1', grade: 1, sections: 1 },
    { id: '2', name: 'Class 2', grade: 2, sections: 1 },
    { id: '3', name: 'Class 3', grade: 3, sections: 1 },
    { id: '4', name: 'Class 4', grade: 4, sections: 1 },
    { id: '5', name: 'Class 5', grade: 5, sections: 1 },
    { id: '6', name: 'Class 6', grade: 6, sections: 3 },
    { id: '7', name: 'Class 7', grade: 7, sections: 3 },
    { id: '8', name: 'Class 8', grade: 8, sections: 3 },
    { id: '9', name: 'Class 9', grade: 9, sections: 5 },
    { id: '10', name: 'Class 10', grade: 10, sections: 5 },
    { id: '11', name: 'Class 11', grade: 11, sections: 5 },
    { id: '12', name: 'Class 12', grade: 12, sections: 5 },
  ];

  for (const c of classes) {
    const classRef = doc(db, 'classes', c.id);
    await setDoc(classRef, {
      id: c.id,
      name: c.name,
      gradeLevel: c.grade
    });

    for (let i = 0; i < c.sections; i++) {
      const sectionId = `${c.id}_${String.fromCharCode(65 + i)}`;
      const sectionRef = doc(db, 'classes', c.id, 'sections', sectionId);
      await setDoc(sectionRef, {
        id: sectionId,
        name: String.fromCharCode(65 + i),
        classId: c.id
      });
    }
  }
};

export const getClasses = async () => {
  const snap = await getDocs(collection(db, 'classes'));
  return snap.docs.map(doc => doc.data() as Class);
};

export const getSections = async (classId: string) => {
  const snap = await getDocs(collection(db, 'classes', classId, 'sections'));
  return snap.docs.map(doc => doc.data() as Section);
};
