<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/user", name="user")
     */
    public function index(): Response
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /**
     * @Route("/AjaxUserGeo", name="ajax_user_geo", methods={"GET", "POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function ajaxUsersList(Request $request): JsonResponse
    {
        $repository = $this->getDoctrine()->getRepository(User::class);
        $allUsers = $repository->findAll();
        $geoUsers = [];
        foreach ($allUsers as $user){
            $geoUsers[] = ["username" => $user->getUsername(), "lat" => $user->getLatitude(), "long" => $user->getLongitude()];
        }
        $content = "";

        $header = '{"type":"FeatureCollection","features":[';
        $bottom = "]}";

        foreach ($geoUsers as $user) {
            $content .= '
                    { "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [' . $user['long'] . ',' . $user['lat'] . ']
                        }
                    },';
        }
        $content = substr($content, 0, -1);
        $response = $header . $content . $bottom;

        return new JsonResponse(
            $response,
            JsonResponse::HTTP_OK
        );
    }
}
