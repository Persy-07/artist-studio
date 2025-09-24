<?php

namespace App\Tests\Integration;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApiIntegrationTest extends WebTestCase
{
    public function testCompleteUserJourney(): void
    {
        $client = static::createClient();
        
        // 1. Accès à la liste des chansons
        $client->request('GET', '/api/songs');
        $this->assertResponseIsSuccessful();
        
        // 2. Recherche de chansons
        $client->request('GET', '/api/songs?search=pop');
        $this->assertResponseIsSuccessful();
        
        // 3. Accès aux catégories
        $client->request('GET', '/api/categories');
        $this->assertResponseIsSuccessful();
        
        // 4. Test de l'endpoint admin stats
        $client->request('GET', '/api/admin/stats');
        $this->assertResponseIsSuccessful();
    }

    public function testApiEndpointsReturnValidJSON(): void
    {
        $client = static::createClient();
        
        $endpoints = ['/api/songs', '/api/categories', '/api/admin/stats'];
        
        foreach ($endpoints as $endpoint) {
            $client->request('GET', $endpoint);
            $this->assertResponseIsSuccessful();
            
            $content = $client->getResponse()->getContent();
            $this->assertJson($content);
            
            $data = json_decode($content, true);
            $this->assertIsArray($data);
        }
    }
}