import { auth, db, storage, doc, getDoc, addDoc, collection, ref, uploadBytes, getDownloadURL, query, where, getDocs } from '../server/firebase.js'

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

        // Get current user's email
        const user = auth.currentUser
        const userEmail = user.email

        console.log(userEmail)

        // Fetch admins' emails
        const usersRef = collection(db, 'users')
        const adminQuery = query(usersRef, where('isAdmin', '==', true))
        const adminSnapshot = await getDocs(adminQuery)

        const adminEmails = adminSnapshot.docs.map(doc => doc.data().email).filter(email => email)

        // Send email to admins
        try {
          const emailResponse = await fetch('/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: adminEmails,
              subject: `New Proof of Participation Submitted for Research "${researchId}"`,
              text: `Dear Admins,\n\nA new proof of participation has been submitted for the research with ID "${researchId}".\nSubmitted by: ${userEmail}\n\nBest regards,\nThe Research Support Hub`,
              html: `<p>Dear Admins,</p><p>A new proof of participation has been submitted for the research with ID "<strong>${researchId}</strong>".</p><p><strong>Submitted by:</strong> ${userEmail}</p><p>Best regards,<br>The Research Support Team</p>`
            })
          })

          if (emailResponse.ok) {
            console.log('Emails sent to admins successfully.')
          } else {
            console.error('Error sending email to admins:', emailResponse.statusText)
          }
        } catch (error) {
          console.error('Error sending email to admins:', error)
        }
        window.location.href = '/res-resources'
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
