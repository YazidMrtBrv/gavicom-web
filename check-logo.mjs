import http from 'http';

http.get('http://localhost:3000/', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const match = data.match(/<img[^>]+src="([^"]+)"[^>]*>/g);
    if (match) match.forEach(m => console.log(m.substring(0, 200)));
    console.log('\nlogo-gavicom in HTML:', data.includes('logo-gavicom'));
    console.log('Gemini in HTML:', data.includes('Gemini'));
  });
}).on('error', e => console.log('ERR:', e.message));
