// API de informações falsas

document.getElementById('load-users').addEventListener('click', function() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';

            data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user';
                
                userDiv.innerHTML = `
                    <h3>${user.name}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>                    
                `
                // Pode adicionar mais coisas exeplo endereço, ip, cidade e assim vai
                ;

                usersList.appendChild(userDiv);
            });
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});
