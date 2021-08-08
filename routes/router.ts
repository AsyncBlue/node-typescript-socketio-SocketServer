import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get( '/mensajes', ( req: Request, res: Response ) => {
    res.json({
        ok: true,
        msg: 'Todo esta bien'
    });
});

router.post( '/mensajes', ( req: Request, res: Response ) => {
    const { cuerpo, de } = req.body;

    const payload = { de, cuerpo };

    const server = Server.instance;

    //Enviar a todo el mundo
    server.io.emit( 'mensaje-nuevo', payload );

    res.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post( '/mensajes/:id', ( req: Request, res: Response ) => {
    const { cuerpo, de } = req.body;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    //Enviar mensaje a un usuario especifico
    server.io.in( id ).emit( 'mensaje-privado', payload );

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

//Obtener todo los IDS de los usuarios
router.get( '/usuarios', ( req: Request, res: Response) => {

    const server = Server.instance;

    server.io.fetchSockets().then( ( clientes ) => {

        const arrIds: Object[] = [];
        clientes.forEach( cliente => arrIds.push( cliente.id ) );

        res.json({
            ok: true,
            arrIds
        });

    }).catch( error => {
        return res.json({
            ok: false,
            error
        });
    });

});

//Obtener usuarios y sus nombres
router.get( '/usuarios/detalle', ( req: Request, res: Response) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});

export default router;