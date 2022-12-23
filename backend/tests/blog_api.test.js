const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

describe('Blog testing', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    console.log('blogs cleared');
    await Blog.insertMany(helper.initialBlogs);
    console.log('blogs saved');
  });

  beforeEach(async () => {
    await User.deleteMany({});
    console.log('users cleared');
    await api.post('/api/users').send(helper.initialUsers[0]);
    console.log('user saved');
  });

  test('blogs are returned as json', async () => {
    console.log('entered test 1');
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs are identified with id', async () => {
    console.log('entered test 2');
    const response = await api.get('/api/blogs');
    const responseBlogs = response.body;

    for (const blog of responseBlogs) {
      expect(blog.id).toBeDefined();
    }
  });

  test('user successfully login with valid username and password', async () => {
    console.log('entered test 3');
    await api
      .post('/api/login')
      .send({
        username: 'Testaaja',
        password: 'testi',
      })
      .expect(200);
  });

  describe('Succesfully adding a new blog', () => {
    test('a new blog can be added with valid data and token', async () => {
      console.log('entered test 4');

      const response = await api
        .post('/api/login')
        .send({
          username: 'Testaaja',
          password: 'testi',
        })
        .expect(200);

      const token = response.body.token;

      const newBlog = {
        title: 'TEST - Lisätään uusi blogi',
        author: 'Vadelma Lakanen',
        url: 'www.uusblogi.com',
        likes: 100,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', ` bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      const titles = blogsAtEnd.map((b) => b.title);

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
      expect(titles).toContain('TEST - Lisätään uusi blogi');
    });

    test('adding a new blog without blog.likes succeeds, but blog.likes is defined as 0', async () => {
      console.log('entered test 5');

      const response = await api
        .post('/api/login')
        .send({
          username: 'Testaaja',
          password: 'testi',
        })
        .expect(200);

      const token = response.body.token;

      const blogWithoutLikes = {
        title: 'Blogi jolla ei ole tykkäyksiä',
        author: 'Eemeli Eerikäinen',
        url: 'www.eitykätä.com',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', ` bearer ${token}`)
        .send(blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
    });
  });

  describe('Failing to add a new blog if data is invalid', () => {
    test('if token is missing, request should return 401 unauthorized', async () => {
      console.log('entered test 6');
      const blogsAtStart = await helper.blogsInDb();

      const newBlog = {
        title: 'Blogin lisäys epäonnistuu ilman tokenia',
        author: 'Vadelma Lakanen',
        url: 'www.uusblogi.com',
        likes: 100,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    });

    test('if blog.title is missing, request should return 400 Bad Request', async () => {
      console.log('entered test 7');

      const response = await api
        .post('/api/login')
        .send({
          username: 'Testaaja',
          password: 'testi',
        })
        .expect(200);

      const token = response.body.token;

      const blogWithoutTitle = {
        author: 'Erkki Esimerkki',
        url: 'www.puuttuutitle.com',
        likes: 2,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', ` bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });

    test('if blog.url is missing, request should return 400 Bad Request', async () => {
      console.log('entered test 8');

      const response = await api
        .post('/api/login')
        .send({
          username: 'Testaaja',
          password: 'testi',
        })
        .expect(200);

      const token = response.body.token;

      const blogWithoutUrl = {
        title: 'Blogilta puuttuu URL',
        author: 'Erkki Esimerkki',
        likes: 2,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', ` bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    });
  });

  describe('Deletion of a specific blog', () => {
    test('succeeds with status code 204 if token and id is valid', async () => {
      console.log('entered test 9');

      const blogsAtStart = await helper.blogsInDb();

      const response = await api
        .post('/api/login')
        .send({
          username: 'Testaaja',
          password: 'testi',
        })
        .expect(200);

      const token = response.body.token;

      const newBlogThatWillBeDeleted = {
        title: 'Lisätään Blogi, joka kohta deletoidaan',
        author: 'Vadelma Lakanen',
        url: 'www.deletoitavablogi.com',
        likes: 1,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', ` bearer ${token}`)
        .send(newBlogThatWillBeDeleted)
        .expect(201);

      const blogsAfterAddition = await helper.blogsInDb();
      const blogToDelete = blogsAfterAddition[2];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', ` bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd).toHaveLength(blogsAfterAddition.length - 1);
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

      const titles = blogsAtEnd.map((b) => b.title);

      expect(titles).not.toContain(blogToDelete.title);
    });
  });

  describe('Modification of a specific blog', () => {
    test('succeeds if id is valid', async () => {
      console.log('entered test 10');
      const blogsAtStart = await helper.blogsInDb();
      const blogToModify = blogsAtStart[1];
      let modifiedBlog = blogsAtStart[1];
      modifiedBlog.likes = 1000000;

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(200);

      const blogsAtEnd = await helper.blogsInDb();

      expect(blogsAtEnd[1].likes).toBe(modifiedBlog.likes);
    });
  });
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh and valid username and valid password', async () => {
    console.log('entered test 11');
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'vlakan',
      name: 'Valtteri Lakanen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    console.log('entered test 12');
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if password is too short', async () => {
    console.log('entered test 13');
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Tepi',
      name: 'Teppo Testaaja',
      password: 'aa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password must be at least 3 characters'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if username is too short', async () => {
    console.log('entered test 14');
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'a',
      name: 'Teppo Testaaja',
      password: 'asdasd',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'User validation failed: username: Path `username`'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
