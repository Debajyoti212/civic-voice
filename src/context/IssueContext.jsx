import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

const IssueContext = createContext(null);

export function IssueProvider({ children }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = [];
      snapshot.forEach((doc) => {
        issuesData.push({ id: doc.id, ...doc.data() });
      });
      setIssues(issuesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching issues:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addIssue = async (issueData) => {
    const newIssue = {
      ...issueData,
      status: 'pending',
      reportedBy: auth.currentUser?.uid || 'unknown_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [],
      rating: null,
      department: null,
    };
    try {
      const docRef = await addDoc(collection(db, 'issues'), newIssue);
      return { id: docRef.id, ...newIssue };
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const updateIssueStatus = async (issueId, status, note = '', by = 'Municipal Staff') => {
    const issueRef = doc(db, 'issues', issueId);
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    const update = { status, note, timestamp: new Date().toISOString(), by };
    
    try {
      await updateDoc(issueRef, {
        status,
        updatedAt: new Date().toISOString(),
        updates: [...(issue.updates || []), update]
      });
    } catch (e) {
      console.error("Error updating status: ", e);
    }
  };

  const assignDepartment = async (issueId, department) => {
    const issueRef = doc(db, 'issues', issueId);
    try {
      await updateDoc(issueRef, { department });
    } catch (e) {
      console.error("Error assigning department: ", e);
    }
  };

  const rateIssue = async (issueId, rating) => {
    const issueRef = doc(db, 'issues', issueId);
    try {
      await updateDoc(issueRef, { rating });
    } catch (e) {
      console.error("Error rating issue: ", e);
    }
  };

  const deleteIssue = async (issueId) => {
    const issueRef = doc(db, 'issues', issueId);
    try {
      await deleteDoc(issueRef);
    } catch (e) {
      console.error("Error deleting issue: ", e);
    }
  };

  const getMyIssues = useCallback(() => {
    if (!auth.currentUser) return [];
    return issues.filter(i => i.reportedBy === auth.currentUser.uid);
  }, [issues]);

  const getIssueById = useCallback((id) => {
    return issues.find(i => i.id === id);
  }, [issues]);

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in_progress' || i.status === 'acknowledged').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    myTotal: issues.filter(i => i.reportedBy === auth.currentUser?.uid).length,
  };

  return (
    <IssueContext.Provider value={{
      issues, stats, addIssue, updateIssueStatus,
      assignDepartment, rateIssue, deleteIssue,
      getMyIssues, getIssueById, loading
    }}>
      {children}
    </IssueContext.Provider>
  );
}

export const useIssues = () => useContext(IssueContext);
