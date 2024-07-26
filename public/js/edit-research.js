import { db, doc, getDoc, updateDoc } from '../server/firebase.js';

// Get research ID from the URL
const pathname = window.location.pathname;
const researchId = pathname.split('/').pop();

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch research details
  try {
    const researchDocRef = doc(db, 'research_requests', researchId);
    const researchDocSnap = await getDoc(researchDocRef);

    if (!researchDocSnap.exists()) {
      console.error('No such document!');
      return;
    }

    const researchData = researchDocSnap.data();
    console.log('Research Data:', researchData);

    document.getElementById('title').value = researchData.title || '';
    document.getElementById('desc').value = researchData.desc || '';
    document.getElementById('contact').value = researchData.contact || '';
    document.getElementById('dg_method').value = researchData.dgMethod || '';
    document.getElementById('typeOfParticipation').value = researchData.typePart || '';
    document.getElementById('dg_link').value = researchData.dgLink || '';
    document.getElementById('start_date').value = researchData.startDate || '';
    document.getElementById('end_date').value = researchData.endDate || '';
  } catch (error) {
    console.error('Error fetching research details:', error);
  }

  // Handle form submission for updating research request
  const editResearchForm = document.getElementById('editResearchForm');
  editResearchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const updatedResearchData = {
        title: document.getElementById('title').value,
        desc: document.getElementById('desc').value,
        contact: document.getElementById('contact').value,
        dgMethod: document.getElementById('dg_method').value,
        typePart: document.getElementById('typeOfParticipation').value,
        dgLink: document.getElementById('dg_link').value,
        startDate: document.getElementById('start_date').value,
        endDate: document.getElementById('end_date').value
      };

      const researchDocRef = doc(db, 'research_requests', researchId);
      await updateDoc(researchDocRef, updatedResearchData);

      alert('Research request updated successfully!');
      window.location.href = '/res-resources';
    } catch (error) {
      console.error('Error updating research request:', error);
      alert('Failed to update research request.');
    }
  });
});
