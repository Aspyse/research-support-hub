import { db, storage, doc, getDoc, addDoc, collection, ref, uploadBytes, getDownloadURL } from '../server/firebase.js'

// Get research ID and user ID from the URL
const pathname = window.location.pathname
const researchId = pathname.split('/').pop()
const urlParams = new URLSearchParams(window.location.search)
const userId = urlParams.get('userId')

console.log('Research ID:', researchId)
console.log('User ID:', userId)

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch research details
  try {
    if (!researchId) {
      throw new Error('Invalid research ID')
    }

    const researchDocRef = doc(db, 'research_requests', researchId)
    const researchDocSnap = await getDoc(researchDocRef)

    if (!researchDocSnap.exists()) {
      console.error('No such document!')
      return
    }

    const researchData = researchDocSnap.data()
    console.log('Research Data:', researchData)

    document.getElementById('research-title').textContent = researchData.title || 'No Title'
    document.getElementById('research-desc').textContent = researchData.desc || 'No Description'
    document.getElementById('research-method').textContent = `Method: ${researchData.dgMethod || 'N/A'}`
    document.getElementById('research-type').textContent = `Type: ${researchData.typePart || 'N/A'}`
    document.getElementById('research-link').innerHTML = `Link: <a href="${researchData.dgLink}" target="_blank">${researchData.dgLink || 'No Link'}</a>`
    document.getElementById('research-dates').textContent = `Dates: ${researchData.startDate || 'N/A'} to ${researchData.endDate || 'N/A'}`
  } catch (error) {
    console.error('Error fetching research details:', error)
  }

  // Handle proof of participation form submission
  const proofForm = document.getElementById('proofForm')
  if (proofForm) {
    proofForm.addEventListener('submit', async (event) => {
      event.preventDefault()

      const proofFile = document.getElementById('proofFile').files[0]
      if (!proofFile) {
        alert('Please select a file to upload.')
        return
      }

      try {
        // Upload the file to Firebase Storage
        const storageRef = ref(storage, `proofs/${userId}/${researchId}/${proofFile.name}`)
        const snapshot = await uploadBytes(storageRef, proofFile)

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref)

        // Save the proof information to Firestore
        await addDoc(collection(db, 'participation_proofs'), {
          userId,
          researchId,
          proofURL: downloadURL,
          timestamp: new Date()
        })

        alert('Proof of participation submitted successfully!')
        proofForm.reset()
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Failed to submit proof of participation.')
      }
    })
  } else {
    console.error('Proof form not found in the document.')
  }
})
