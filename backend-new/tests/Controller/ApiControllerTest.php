<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApiControllerTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testApiHealthCheck(): void
    {
        $this->client->request('GET', '/api/test');
        $this->assertResponseIsSuccessful();
        
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('status', $responseData);
        $this->assertEquals('Connexion réussie !', $responseData['status']);
    }

    public function testGetSongsEndpoint(): void
    {
        $this->client->request('GET', '/api/songs');
        $this->assertResponseIsSuccessful();
        
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertIsArray($responseData);
    }

    public function testLoginWithValidCredentials(): void
    {
        $this->client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'email' => 'admin@artiststudio.com',
                'password' => 'admin2024'
            ])
        );

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('user', $responseData);
    }

    public function testAdminStatsAccess(): void
    {
        $this->client->request('GET', '/api/admin/stats');
        $this->assertResponseIsSuccessful();
        
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('totalSongs', $responseData);
    }
}